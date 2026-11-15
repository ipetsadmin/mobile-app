import { act } from "@testing-library/react-native"

import { fillForm } from "@/test/fill-form"
import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { useResetPasswordForm } from "./use-reset-password-form"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)
jest.mock("expo-linking", () => ({
  createURL: jest.fn((path: string) => `truffa://${path}`),
}))

async function setup() {
  const onRequested = jest.fn()
  const hook = await renderHookWithProviders(() =>
    useResetPasswordForm({ onRequested }),
  )

  return { ...hook, onRequested }
}

describe("useResetPasswordForm", () => {
  it("does not request a reset for an invalid email", async () => {
    const { result } = await setup()

    await act(async () => {
      await fillForm(result.current.control, { email: "ana" })
      await result.current.submit()
    })

    expect(authClient.requestPasswordReset).not.toHaveBeenCalled()
  })

  it("requests the reset, confirms it and notifies the caller", async () => {
    authClient.requestPasswordReset.mockResolvedValue({ error: null })
    const { result, onRequested } = await setup()

    await act(async () => {
      await fillForm(result.current.control, { email: "ana@example.com" })
      await result.current.submit()
    })

    expect(authClient.requestPasswordReset).toHaveBeenCalledWith(
      expect.objectContaining({ email: "ana@example.com" }),
    )
    expect(toast.success).toHaveBeenCalledWith(translate("resetPassword.sent"))
    expect(onRequested).toHaveBeenCalledTimes(1)
  })

  it("shows an error and does not notify when the request fails", async () => {
    authClient.requestPasswordReset.mockResolvedValue({
      error: { message: "x" },
    })
    const { result, onRequested } = await setup()

    await act(async () => {
      await fillForm(result.current.control, { email: "ana@example.com" })
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(translate("resetPassword.error"))
    expect(onRequested).not.toHaveBeenCalled()
  })
})
