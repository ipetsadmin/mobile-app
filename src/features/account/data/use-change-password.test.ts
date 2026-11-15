import { act } from "@testing-library/react-native"

import { authClient } from "@/test/mocks/auth-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useChangePassword } from "./use-change-password"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)

const values = {
  currentPassword: "old-secret",
  newPassword: "12345678",
  confirmPassword: "12345678",
}

describe("useChangePassword", () => {
  it("changes the password and revokes the other sessions", async () => {
    authClient.changePassword.mockResolvedValue({ error: null })
    const { result } = await renderHookWithProviders(() => useChangePassword())

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(authClient.changePassword).toHaveBeenCalledWith({
      currentPassword: "old-secret",
      newPassword: "12345678",
      revokeOtherSessions: true,
    })
  })

  it("does not send the confirmation", async () => {
    authClient.changePassword.mockResolvedValue({ error: null })
    const { result } = await renderHookWithProviders(() => useChangePassword())

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(authClient.changePassword.mock.calls[0][0]).not.toHaveProperty(
      "confirmPassword",
    )
  })

  it("throws the error returned by the auth client", async () => {
    const error = { message: "Wrong password" }
    authClient.changePassword.mockResolvedValue({ error })
    const { result } = await renderHookWithProviders(() => useChangePassword())

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toBe(error)
    })
  })
})
