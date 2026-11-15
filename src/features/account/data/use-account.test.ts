import { waitFor } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { apiClient, ok } from "@/test/mocks/api-client"
import { sessionState } from "@/test/mocks/session"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useAccount } from "./use-account"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const profileResponse = (overrides: Record<string, unknown> = {}) =>
  ok({
    profile: {
      firstName: "Ana",
      lastName: "Gomez",
      avatar: "https://img/a.jpg",
    },
    preferences: { notifications: { push: true, email: false } },
    ...overrides,
  })

describe("useAccount", () => {
  it("builds the account from the profile and the session", async () => {
    apiClient.users.getProfile.mockResolvedValue(profileResponse())

    const { result } = await renderHookWithProviders(() => useAccount())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.account).toEqual({
      firstName: "Ana",
      lastName: "Gomez",
      name: "Ana Gomez",
      email: "ana@example.com",
      photoUri: "https://img/a.jpg",
      notifications: { push: true, email: false },
    })
  })

  it("falls back to the session name while there is no profile", async () => {
    apiClient.users.getProfile.mockReturnValue(new Promise(() => {}))
    const { result } = await renderHookWithProviders(() => useAccount())

    expect(result.current.account.name).toBe("Ana Gomez")
    expect(result.current.account.firstName).toBe("")
    expect(result.current.account.photoUri).toBeUndefined()
  })

  it("uses defaults for notifications without preferences", async () => {
    apiClient.users.getProfile.mockResolvedValue(
      profileResponse({ preferences: undefined }),
    )

    const { result } = await renderHookWithProviders(() => useAccount())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.account.notifications).toEqual({
      push: false,
      email: true,
    })
  })

  it("has no photo when the avatar is null", async () => {
    apiClient.users.getProfile.mockResolvedValue(
      profileResponse({
        profile: { firstName: "Ana", lastName: "Gomez", avatar: null },
      }),
    )

    const { result } = await renderHookWithProviders(() => useAccount())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.account.photoUri).toBeUndefined()
  })

  it("stores the profile under the account key of the user", async () => {
    apiClient.users.getProfile.mockResolvedValue(profileResponse())

    const { result, queryClient } = await renderHookWithProviders(() =>
      useAccount(),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      queryClient.getQueryData(queryKeys.account.profile("user-1")),
    ).toBeDefined()
  })

  it("does not fetch the profile without a session", async () => {
    sessionState.current = null

    const { result } = await renderHookWithProviders(() => useAccount())

    expect(result.current.fetchStatus).toBe("idle")
    expect(result.current.account.email).toBe("")
    expect(apiClient.users.getProfile).not.toHaveBeenCalled()
  })
})
