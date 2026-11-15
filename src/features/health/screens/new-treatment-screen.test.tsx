import { TreatmentType } from "@ipetsadmin/contracts"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import { toast } from "@/test/mocks/toast"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { NewTreatmentScreen } from "./new-treatment-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const field = (key: string) => screen.getByLabelText(translate(key))
const submit = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("treatment.submit") }),
  )

const chooseType = async () => {
  await fireEvent.press(
    screen.getByRole("button", { name: translate("treatment.type") }),
  )
  await fireEvent.press(
    screen.getByRole("radio", {
      name: translate("treatment.types.medication"),
    }),
  )
}

const fillTreatment = async () => {
  await chooseType()
  await fireEvent.changeText(field("treatment.name"), "Amoxicillin")
  await fireEvent.changeText(field("treatment.dosage"), "1 tablet")
  await fireEvent.changeText(field("treatment.frequencyHours"), "8")
  await fireEvent.changeText(field("treatment.durationDays"), "5")
}

describe("NewTreatmentScreen", () => {
  it("shows every field of the treatment", async () => {
    await renderWithProviders(
      <NewTreatmentScreen petId="pet-1" onTreatmentSaved={jest.fn()} />,
    )

    for (const key of [
      "treatment.name",
      "treatment.dosage",
      "treatment.frequencyHours",
      "treatment.durationDays",
      "treatment.instructions",
    ]) {
      expect(field(key)).toBeOnTheScreen()
    }
  })

  it("offers every type except vaccination", async () => {
    await renderWithProviders(
      <NewTreatmentScreen petId="pet-1" onTreatmentSaved={jest.fn()} />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("treatment.type") }),
    )

    expect(
      screen.getByRole("radio", {
        name: translate("treatment.types.medication"),
      }),
    ).toBeOnTheScreen()
    expect(
      screen.queryByRole("radio", { name: translate("vaccine.title") }),
    ).not.toBeOnTheScreen()
  })

  it("does not save an incomplete treatment", async () => {
    await renderWithProviders(
      <NewTreatmentScreen petId="pet-1" onTreatmentSaved={jest.fn()} />,
    )

    await submit()

    expect(
      await screen.findByText(translate("validation.selectOption")),
    ).toBeOnTheScreen()
    expect(apiClient.pets.createTreatment).not.toHaveBeenCalled()
  })

  it("rejects a frequency that is not a positive integer", async () => {
    await renderWithProviders(
      <NewTreatmentScreen petId="pet-1" onTreatmentSaved={jest.fn()} />,
    )

    await fillTreatment()
    await fireEvent.changeText(field("treatment.frequencyHours"), "1.5")
    await submit()

    expect(
      await screen.findByText(translate("validation.positiveInteger")),
    ).toBeOnTheScreen()
    expect(apiClient.pets.createTreatment).not.toHaveBeenCalled()
  })

  it("saves the treatment for the pet and notifies the caller", async () => {
    apiClient.pets.createTreatment.mockResolvedValue(ok({}))
    const onTreatmentSaved = jest.fn()
    await renderWithProviders(
      <NewTreatmentScreen petId="pet-1" onTreatmentSaved={onTreatmentSaved} />,
    )

    await fillTreatment()
    await submit()

    await waitFor(() => expect(onTreatmentSaved).toHaveBeenCalledTimes(1))
    expect(apiClient.pets.createTreatment).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      expect.objectContaining({
        medicationName: "Amoxicillin",
        treatmentType: TreatmentType.MEDICATION,
        totalDoses: 15,
      }),
    )
  })

  it("shows an error and stays open when saving fails", async () => {
    apiClient.pets.createTreatment.mockRejectedValue(new Error("boom"))
    const onTreatmentSaved = jest.fn()
    await renderWithProviders(
      <NewTreatmentScreen petId="pet-1" onTreatmentSaved={onTreatmentSaved} />,
    )

    await fillTreatment()
    await submit()

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(translate("treatment.error")),
    )
    expect(onTreatmentSaved).not.toHaveBeenCalled()
  })
})
