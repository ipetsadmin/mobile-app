import { act } from "@testing-library/react-native"

import { authClient } from "@/test/mocks/auth-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useSetNewPassword } from "./use-set-new-password"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)

const args = { token: "reset-token", newPassword: "12345678" }

describe("useSetNewPassword", () => {
  it("resets the password with the token", async () => {
    authClient.resetPassword.mockResolvedValue({ error: null })
    const { result } = await renderHookWithProviders(() => useSetNewPassword())

    await act(async () => {
      await result.current.mutateAsync(args)
    })

    expect(authClient.resetPassword).toHaveBeenCalledWith(args)
  })

  it("throws the error returned by the auth client", async () => {
    const error = { message: "Expired" }
    authClient.resetPassword.mockResolvedValue({ error })
    const { result } = await renderHookWithProviders(() => useSetNewPassword())

    await act(async () => {
      await expect(result.current.mutateAsync(args)).rejects.toBe(error)
    })
  })
})
