import { act } from "@testing-library/react-native"

import { fillForm } from "@/test/fill-form"
import { apiClient, ok } from "@/test/mocks/api-client"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { useVaccineForm } from "./use-vaccine-form"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const values = {
  name: "Rabies",
  administeredAt: new Date("2026-01-10T10:00:00.000Z"),
}

async function setup() {
  const onVaccineSaved = jest.fn()
  const hook = await renderHookWithProviders(() =>
    useVaccineForm({ petId: "pet-1", onVaccineSaved }),
  )

  return { ...hook, onVaccineSaved }
}

describe("useVaccineForm", () => {
  it("does not save without a name", async () => {
    const { result, onVaccineSaved } = await setup()

    await act(async () => {
      await result.current.submit()
    })

    expect(apiClient.pets.createTreatment).not.toHaveBeenCalled()
    expect(onVaccineSaved).not.toHaveBeenCalled()
  })

  it("requires laboratory and lot together", async () => {
    const { result } = await setup()

    await act(async () => {
      await fillForm(result.current.control, {
        ...values,
        laboratory: "Zoetis",
      })
      await result.current.submit()
    })

    expect(apiClient.pets.createTreatment).not.toHaveBeenCalled()
  })

  it("saves the vaccine for the pet and notifies the caller", async () => {
    apiClient.pets.createTreatment.mockResolvedValue(ok({}))
    const { result, onVaccineSaved } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(apiClient.pets.createTreatment).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      expect.objectContaining({ medicationName: "Rabies", ownerId: "user-1" }),
    )
    expect(onVaccineSaved).toHaveBeenCalledTimes(1)
  })

  it("shows an error and keeps the form open when saving fails", async () => {
    apiClient.pets.createTreatment.mockRejectedValue(new Error("boom"))
    const { result, onVaccineSaved } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(translate("vaccine.error"))
    expect(onVaccineSaved).not.toHaveBeenCalled()
  })
})
