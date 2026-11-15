import { TreatmentStatus, TreatmentType } from "@ipetsadmin/contracts"
import { screen } from "@testing-library/react-native"

import { makeTreatment } from "@/test/factories/make-treatment"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { TreatmentList } from "./treatment-list"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

describe("TreatmentList", () => {
  it("shows the title and the empty text without treatments", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(ok([]))

    await renderWithProviders(<TreatmentList petId="pet-1" />)

    expect(screen.getByText(translate("treatment.listTitle"))).toBeOnTheScreen()
    expect(
      await screen.findByText(translate("treatment.empty")),
    ).toBeOnTheScreen()
  })

  it("does not list vaccines", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(
      ok([
        makeTreatment({
          id: "v",
          medicationName: "Rabies",
          treatmentType: TreatmentType.VACCINATION,
        }),
        makeTreatment({ id: "m", medicationName: "Amoxicillin" }),
      ]),
    )

    await renderWithProviders(<TreatmentList petId="pet-1" />)

    expect(await screen.findByText("Amoxicillin")).toBeOnTheScreen()
    expect(screen.queryByText("Rabies")).not.toBeOnTheScreen()
  })

  it("lists the unfinished treatments before the finished ones", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(
      ok([
        makeTreatment({
          id: "done",
          medicationName: "Finished",
          status: TreatmentStatus.COMPLETED,
        }),
        makeTreatment({
          id: "going",
          medicationName: "Ongoing",
          status: TreatmentStatus.IN_PROGRESS,
        }),
      ]),
    )

    await renderWithProviders(<TreatmentList petId="pet-1" />)

    await screen.findByText("Ongoing")
    const names = screen
      .getAllByText(/Finished|Ongoing/)
      .map((node) => node.props.children)

    expect(names).toEqual(["Ongoing", "Finished"])
  })
})
