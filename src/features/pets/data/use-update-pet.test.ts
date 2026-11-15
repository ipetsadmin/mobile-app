import { act } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { makeCompanionValues } from "@/test/factories/make-companion-values"
import { apiClient, ok } from "@/test/mocks/api-client"
import { spyOnInvalidations } from "@/test/query-helpers"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { toPetDetailsBody } from "./to-pet-details-body"
import { useUpdatePet } from "./use-update-pet"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const values = makeCompanionValues()

describe("useUpdatePet", () => {
  it("sends the pet details body for the given pet", async () => {
    apiClient.pets.update.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() => useUpdatePet())

    await act(async () => {
      await result.current.mutateAsync({ petId: "pet-9", values })
    })

    expect(apiClient.pets.update).toHaveBeenCalledWith(
      "session-cookie",
      "pet-9",
      toPetDetailsBody(values),
    )
  })

  it("invalidates the pets and the agenda", async () => {
    apiClient.pets.update.mockResolvedValue(ok({}))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useUpdatePet(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await result.current.mutateAsync({ petId: "pet-9", values })
    })

    expect(invalidated()).toEqual([queryKeys.pets.all, queryKeys.agenda.all])
  })

  it("does not invalidate when the request fails", async () => {
    apiClient.pets.update.mockRejectedValue(new Error("boom"))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useUpdatePet(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await expect(
        result.current.mutateAsync({ petId: "pet-9", values }),
      ).rejects.toThrow("boom")
    })

    expect(invalidated()).toEqual([])
  })
})
