import { TreatmentType } from "@ipetsadmin/contracts"
import { act } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { apiClient, ok } from "@/test/mocks/api-client"
import { sessionState } from "@/test/mocks/session"
import { spyOnInvalidations } from "@/test/query-helpers"
import { renderHookWithProviders } from "@/test/render-with-providers"

import type { VaccineValues } from "../schema/vaccine.schema"
import { toCreateVaccineBody } from "./to-create-vaccine-body"
import { useCreateVaccine } from "./use-create-vaccine"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const values: VaccineValues = {
  name: "Rabies",
  administeredAt: new Date("2026-06-10T10:00:00.000Z"),
}

describe("useCreateVaccine", () => {
  it("registers the vaccine as a vaccination treatment", async () => {
    apiClient.pets.createTreatment.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() =>
      useCreateVaccine("pet-1"),
    )

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(apiClient.pets.createTreatment).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
      toCreateVaccineBody("user-1", values),
    )
    expect(apiClient.pets.createTreatment.mock.calls[0][2].treatmentType).toBe(
      TreatmentType.VACCINATION,
    )
  })

  it("invalidates treatments, the pet detail and the agenda", async () => {
    apiClient.pets.createTreatment.mockResolvedValue(ok({}))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useCreateVaccine("pet-1"),
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
      useCreateVaccine("pet-1"),
    )

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toThrow(
        "Missing session",
      )
    })

    expect(apiClient.pets.createTreatment).not.toHaveBeenCalled()
  })
})
