import { TreatmentType } from "@ipetsadmin/contracts"
import { act } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { apiClient, ok } from "@/test/mocks/api-client"
import { sessionState } from "@/test/mocks/session"
import { spyOnInvalidations } from "@/test/query-helpers"
import { renderHookWithProviders } from "@/test/render-with-providers"

import type { TreatmentValues } from "../schema/treatment.schema"
import { toCreateTreatmentBody } from "./to-create-treatment-body"
import { useCreateTreatment } from "./use-create-treatment"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const values: TreatmentValues = {
  treatmentType: TreatmentType.MEDICATION,
  name: "Amoxicillin",
  dosage: "1 tablet",
  startDate: new Date("2099-06-15T08:00:00.000Z"),
  frequencyHours: "8",
  durationDays: "5",
}

describe("useCreateTreatment", () => {
  it("creates the treatment for the pet with the owner from the session", async () => {
    apiClient.pets.createTreatment.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() =>
      useCreateTreatment("pet-1"),
    )

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(apiClient.pets.createTreatment).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      toCreateTreatmentBody("user-1", values),
    )
  })

  it("invalidates treatments, the pet detail and the agenda", async () => {
    apiClient.pets.createTreatment.mockResolvedValue(ok({}))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useCreateTreatment("pet-1"),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(invalidated()).toEqual([
      queryKeys.treatments.all,
      queryKeys.pets.detail("pet-1"),
      queryKeys.agenda.all,
    ])
  })

  it("fails without a session and does not call the API", async () => {
    sessionState.current = null
    const { result } = await renderHookWithProviders(() =>
      useCreateTreatment("pet-1"),
    )

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toThrow(
        "Missing session",
      )
    })

    expect(apiClient.pets.createTreatment).not.toHaveBeenCalled()
  })
})
