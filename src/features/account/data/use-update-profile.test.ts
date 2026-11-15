import { act } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { apiClient, ok } from "@/test/mocks/api-client"
import { spyOnInvalidations } from "@/test/query-helpers"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useUpdateProfile } from "./use-update-profile"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const values = {
  firstName: " Ana ",
  lastName: " Gomez ",
  photoUri: "file:///a.jpg",
}

describe("useUpdateProfile", () => {
  it("sends the trimmed names and not the photo", async () => {
    apiClient.users.patchProfile.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() => useUpdateProfile())

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(apiClient.users.patchProfile).toHaveBeenCalledWith(
      "session-cookie",
      {
        firstName: "Ana",
        lastName: "Gomez",
      },
    )
  })

  it("invalidates the account", async () => {
    apiClient.users.patchProfile.mockResolvedValue(ok({}))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useUpdateProfile(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(invalidated()).toEqual([queryKeys.account.all])
  })

  it("does not invalidate when the request fails", async () => {
    apiClient.users.patchProfile.mockRejectedValue(new Error("boom"))
    const { result, queryClient } = await renderHookWithProviders(() =>
      useUpdateProfile(),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toThrow("boom")
    })

    expect(invalidated()).toEqual([])
  })
})
