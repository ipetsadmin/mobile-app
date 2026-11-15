import { waitFor } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { usePet } from "./use-pet"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

describe("usePet", () => {
  it("loads the pet by id", async () => {
    const pet = makePet({ id: "pet-9" })
    apiClient.pets.getById.mockResolvedValue(ok(pet))

    const { result } = await renderHookWithProviders(() => usePet("pet-9"))

    await waitFor(() => expect(result.current.data).toEqual(pet))
    expect(apiClient.pets.getById).toHaveBeenCalledWith(
      "session-cookie",
      "pet-9",
    )
  })

  it("converts serialized dates into Date objects", async () => {
    apiClient.pets.getById.mockResolvedValue(
      ok(
        makePet({
          beenWithUsSince: {
            ...makePet().beenWithUsSince,
            date: "2023-05-01T12:00:00.000Z" as unknown as Date,
          },
        }),
      ),
    )

    const { result } = await renderHookWithProviders(() => usePet("pet-1"))

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data?.beenWithUsSince.date).toBeInstanceOf(Date)
  })

  it("stores the result under the pet detail key", async () => {
    apiClient.pets.getById.mockResolvedValue(ok(makePet()))

    const { result, queryClient } = await renderHookWithProviders(() =>
      usePet("pet-1"),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      queryClient.getQueryData(queryKeys.pets.detail("pet-1")),
    ).toBeDefined()
  })

  it("fails when the response has no data", async () => {
    apiClient.pets.getById.mockResolvedValue({ success: true })

    const { result } = await renderHookWithProviders(() => usePet("pet-1"))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe("Missing pet")
  })
})
