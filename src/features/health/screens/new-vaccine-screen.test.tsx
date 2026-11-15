import { TreatmentType } from "@ipetsadmin/contracts"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import { toast } from "@/test/mocks/toast"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { NewVaccineScreen } from "./new-vaccine-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const field = (key: string) => screen.getByLabelText(translate(key))
const submit = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("vaccine.submit") }),
  )

describe("NewVaccineScreen", () => {
  it("shows every field of the vaccine", async () => {
    await renderWithProviders(
      <NewVaccineScreen petId="pet-1" onVaccineSaved={jest.fn()} />,
    )

    for (const key of [
      "vaccine.name",
      "vaccine.laboratory",
      "vaccine.lotNumber",
      "vaccine.notes",
    ]) {
      expect(field(key)).toBeOnTheScreen()
    }
    expect(
      screen.getByRole("button", { name: translate("vaccine.submit") }),
    ).toBeOnTheScreen()
  })

  it("does not save without a name", async () => {
    const onVaccineSaved = jest.fn()
    await renderWithProviders(
      <NewVaccineScreen petId="pet-1" onVaccineSaved={onVaccineSaved} />,
    )

    await submit()

    expect(
      await screen.findByText(translate("validation.required")),
    ).toBeOnTheScreen()
    expect(apiClient.pets.createTreatment).not.toHaveBeenCalled()
  })

  it("asks for the lot when only the laboratory is filled", async () => {
    await renderWithProviders(
      <NewVaccineScreen petId="pet-1" onVaccineSaved={jest.fn()} />,
    )

    await fireEvent.changeText(field("vaccine.name"), "Rabies")
    await fireEvent.changeText(field("vaccine.laboratory"), "Zoetis")
    await submit()

    expect(
      await screen.findByText(translate("validation.required")),
    ).toBeOnTheScreen()
    expect(apiClient.pets.createTreatment).not.toHaveBeenCalled()
  })

  it("saves the vaccine for the pet and notifies the caller", async () => {
    apiClient.pets.createTreatment.mockResolvedValue(ok({}))
    const onVaccineSaved = jest.fn()
    await renderWithProviders(
      <NewVaccineScreen petId="pet-1" onVaccineSaved={onVaccineSaved} />,
    )

    await fireEvent.changeText(field("vaccine.name"), "Rabies")
    await submit()

    await waitFor(() => expect(onVaccineSaved).toHaveBeenCalledTimes(1))
    expect(apiClient.pets.createTreatment).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      expect.objectContaining({
        medicationName: "Rabies",
        treatmentType: TreatmentType.VACCINATION,
      }),
    )
  })

  it("shows an error and stays open when saving fails", async () => {
    apiClient.pets.createTreatment.mockRejectedValue(new Error("boom"))
    const onVaccineSaved = jest.fn()
    await renderWithProviders(
      <NewVaccineScreen petId="pet-1" onVaccineSaved={onVaccineSaved} />,
    )

    await fireEvent.changeText(field("vaccine.name"), "Rabies")
    await submit()

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(translate("vaccine.error")),
    )
    expect(onVaccineSaved).not.toHaveBeenCalled()
  })
})
