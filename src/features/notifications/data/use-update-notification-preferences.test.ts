import { act } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { apiClient, ok } from "@/test/mocks/api-client"
import { spyOnInvalidations } from "@/test/query-helpers"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useUpdateNotificationPreferences } from "./use-update-notification-preferences"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const preferences = { push: true, email: false }

describe("useUpdateNotificationPreferences", () => {
  it("sends the push and email preferences", async () => {
    apiClient.users.patchPreferences.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() =>
      useUpdateNotificationPreferences(),
    )

    await act(async () => {
      await result.current.mutateAsync(preferences)
    })

    expect(apiClient.users.patchPreferences).toHaveBeenCalledWith(
      "session-cookie",
      {
        notifications: preferences,
      },
    )
  })

  it("invalidates the account", async () => {
    apiClient.users.patchPreferences.mockResolvedValue(ok({}))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useUpdateNotificationPreferences(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await result.current.mutateAsync(preferences)
    })

    expect(invalidated()).toEqual([queryKeys.account.all])
  })

  it("does not invalidate when the request fails", async () => {
    apiClient.users.patchPreferences.mockRejectedValue(new Error("boom"))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useUpdateNotificationPreferences(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await expect(result.current.mutateAsync(preferences)).rejects.toThrow(
        "boom",
      )
    })

    expect(invalidated()).toEqual([])
  })
})
