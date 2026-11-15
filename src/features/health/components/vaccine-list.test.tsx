import { TreatmentType } from "@ipetsadmin/contracts"
import { fireEvent, screen } from "@testing-library/react-native"

import { makeTreatment } from "@/test/factories/make-treatment"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { VaccineList } from "./vaccine-list"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const vaccine = (id: string, name: string, startDate?: Date) =>
  makeTreatment({
    id,
    medicationName: name,
    treatmentType: TreatmentType.VACCINATION,
    startDate,
  })

describe("VaccineList", () => {
  it("shows a spinner while loading", async () => {
    apiClient.pets.getTreatments.mockReturnValue(new Promise(() => {}))

    await renderWithProviders(<VaccineList petId="pet-1" />)

    expect(
      screen.queryByText(translate("vaccine.listTitle")),
    ).not.toBeOnTheScreen()
  })

  it("shows the error and retries when asked", async () => {
    apiClient.pets.getTreatments.mockRejectedValueOnce(new Error("boom"))
    apiClient.pets.getTreatments.mockResolvedValue(
      ok([vaccine("a", "Rabies", new Date(2026, 5, 10))]),
    )

    await renderWithProviders(<VaccineList petId="pet-1" />)
    expect(
      await screen.findByText(translate("common.loadError")),
    ).toBeOnTheScreen()

    await fireEvent.press(
      screen.getByRole("button", { name: translate("common.retry") }),
    )

    expect(await screen.findByText("Rabies")).toBeOnTheScreen()
  })

  it("shows the empty text without vaccines", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(
      ok([makeTreatment({ treatmentType: TreatmentType.MEDICATION })]),
    )

    await renderWithProviders(<VaccineList petId="pet-1" />)

    expect(
      await screen.findByText(translate("vaccine.empty")),
    ).toBeOnTheScreen()
  })

  it("lists only vaccines, the most recent first, with their date", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(
      ok([
        vaccine("old", "Old shot", new Date(2025, 0, 10)),
        vaccine("new", "New shot", new Date(2026, 5, 10)),
        makeTreatment({ id: "med", medicationName: "Amoxicillin" }),
      ]),
    )

    await renderWithProviders(<VaccineList petId="pet-1" />)

    await screen.findByText("New shot")
    const names = screen.getAllByText(/shot/).map((node) => node.props.children)

    expect(names).toEqual(["New shot", "Old shot"])
    expect(screen.getByText("10 jun 2026")).toBeOnTheScreen()
    expect(screen.queryByText("Amoxicillin")).not.toBeOnTheScreen()
  })

  it("shows a vaccine without a date", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(
      ok([vaccine("a", "Undated", undefined)]),
    )

    await renderWithProviders(<VaccineList petId="pet-1" />)

    expect(await screen.findByText("Undated")).toBeOnTheScreen()
  })
})
