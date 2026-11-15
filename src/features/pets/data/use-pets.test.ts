import { waitFor } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import { sessionState } from "@/test/mocks/session"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { usePets } from "./use-pets"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

describe("usePets", () => {
  it("loads the pets of the signed in user", async () => {
    const pet = makePet()
    apiClient.users.getPets.mockResolvedValue(ok([pet]))

    const { result } = await renderHookWithProviders(() => usePets())

    await waitFor(() => expect(result.current.data).toEqual([pet]))
    expect(apiClient.users.getPets).toHaveBeenCalledWith(
      "session-cookie",
      "user-1",
    )
  })

  it("converts serialized dates into Date objects", async () => {
    const serialized = makePet({
      birthDate: {
        ...makePet().birthDate,
        date: "2023-03-10T12:00:00.000Z" as unknown as Date,
      },
    })
    apiClient.users.getPets.mockResolvedValue(ok([serialized]))

    const { result } = await renderHookWithProviders(() => usePets())

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data?.[0].birthDate.date).toBeInstanceOf(Date)
  })

  it("stores the result under the pets list key of the user", async () => {
    apiClient.users.getPets.mockResolvedValue(ok([makePet()]))

    const { result, queryClient } = await renderHookWithProviders(() =>
      usePets(),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      queryClient.getQueryData(queryKeys.pets.list("user-1")),
    ).toBeDefined()
  })

  it("does not fetch without a session", async () => {
    sessionState.current = null

    const { result } = await renderHookWithProviders(() => usePets())

    expect(result.current.fetchStatus).toBe("idle")
    expect(apiClient.users.getPets).not.toHaveBeenCalled()
  })

  it("fails when the response has no data", async () => {
    apiClient.users.getPets.mockResolvedValue({ success: true })

    const { result } = await renderHookWithProviders(() => usePets())

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe("Missing pets")
  })

  it("surfaces API errors", async () => {
    apiClient.users.getPets.mockRejectedValue(new Error("boom"))

    const { result } = await renderHookWithProviders(() => usePets())

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
