import { waitFor } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { usePetTreatments } from "./use-pet-treatments"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

describe("usePetTreatments", () => {
  it("loads the treatments of the pet", async () => {
    const treatments = [{ id: "treatment-1" }]
    apiClient.pets.getTreatments.mockResolvedValue(ok(treatments))

    const { result } = await renderHookWithProviders(() =>
      usePetTreatments("pet-1"),
    )

    await waitFor(() => expect(result.current.data).toEqual(treatments))
    expect(apiClient.pets.getTreatments).toHaveBeenCalledWith(
      "session-cookie",
      "pet-1",
    )
  })

  it("returns an empty list when the response has no data", async () => {
    apiClient.pets.getTreatments.mockResolvedValue({ success: true })

    const { result } = await renderHookWithProviders(() =>
      usePetTreatments("pet-1"),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })

  it("stores the result under the list key of the pet", async () => {
    apiClient.pets.getTreatments.mockResolvedValue(ok([]))

    const { result, queryClient } = await renderHookWithProviders(() =>
      usePetTreatments("pet-1"),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      queryClient.getQueryData(queryKeys.treatments.list("pet-1")),
    ).toBeDefined()
  })
})
