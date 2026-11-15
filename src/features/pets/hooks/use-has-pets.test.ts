import { waitFor } from "@testing-library/react-native"

import { makePet } from "@/test/factories/make-pet"
import { apiClient, ok } from "@/test/mocks/api-client"
import { sessionState } from "@/test/mocks/session"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useHasPets } from "./use-has-pets"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

describe("useHasPets", () => {
  it("is not resolved while the pets are loading", async () => {
    apiClient.users.getPets.mockReturnValue(new Promise(() => {}))

    const { result } = await renderHookWithProviders(() => useHasPets())

    expect(result.current).toEqual({ hasPets: false, isResolved: false })
  })

  it("has pets when the user has at least one", async () => {
    apiClient.users.getPets.mockResolvedValue(ok([makePet()]))

    const { result } = await renderHookWithProviders(() => useHasPets())

    await waitFor(() =>
      expect(result.current).toEqual({ hasPets: true, isResolved: true }),
    )
  })

  it("is resolved without pets for a new user", async () => {
    apiClient.users.getPets.mockResolvedValue(ok([]))

    const { result } = await renderHookWithProviders(() => useHasPets())

    await waitFor(() =>
      expect(result.current).toEqual({ hasPets: false, isResolved: true }),
    )
  })

  it("never resolves without a session", async () => {
    sessionState.current = null

    const { result } = await renderHookWithProviders(() => useHasPets())

    expect(result.current.isResolved).toBe(false)
  })
})
