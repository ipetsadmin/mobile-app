import { TreatmentType } from "@ipetsadmin/contracts"
import { act } from "@testing-library/react-native"

import { fillForm } from "@/test/fill-form"
import { apiClient, ok } from "@/test/mocks/api-client"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { useTreatmentForm } from "./use-treatment-form"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const values = {
  treatmentType: TreatmentType.MEDICATION,
  name: "Amoxicillin",
  dosage: "1 tablet",
  frequencyHours: "8",
  durationDays: "5",
}

async function setup() {
  const onTreatmentSaved = jest.fn()
  const hook = await renderHookWithProviders(() =>
    useTreatmentForm({ petId: "pet-1", onTreatmentSaved }),
  )

  return { ...hook, onTreatmentSaved }
}

describe("useTreatmentForm", () => {
  it("does not save an incomplete treatment", async () => {
    const { result, onTreatmentSaved } = await setup()

    await act(async () => {
      await result.current.submit()
    })

    expect(apiClient.pets.createTreatment).not.toHaveBeenCalled()
    expect(onTreatmentSaved).not.toHaveBeenCalled()
  })

  it("rejects a frequency that is not a positive integer", async () => {
    const { result } = await setup()

    await act(async () => {
      await fillForm(result.current.control, {
        ...values,
        frequencyHours: "1.5",
      })
      await result.current.submit()
    })

    expect(apiClient.pets.createTreatment).not.toHaveBeenCalled()
  })

  it("saves the treatment for the pet and notifies the caller", async () => {
    apiClient.pets.createTreatment.mockResolvedValue(ok({}))
    const { result, onTreatmentSaved } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(apiClient.pets.createTreatment).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      expect.objectContaining({
        medicationName: "Amoxicillin",
        totalDoses: 15,
      }),
    )
    expect(onTreatmentSaved).toHaveBeenCalledTimes(1)
  })

  it("shows an error and keeps the form open when saving fails", async () => {
    apiClient.pets.createTreatment.mockRejectedValue(new Error("boom"))
    const { result, onTreatmentSaved } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(translate("treatment.error"))
    expect(onTreatmentSaved).not.toHaveBeenCalled()
  })
})
