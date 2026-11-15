import { act } from "@testing-library/react-native"

import { fillForm } from "@/test/fill-form"
import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { useNewPasswordForm } from "./use-new-password-form"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)

const matching = { newPassword: "12345678", confirmPassword: "12345678" }

async function setup() {
  const onPasswordSet = jest.fn()
  const hook = await renderHookWithProviders(() =>
    useNewPasswordForm({ token: "reset-token", onPasswordSet }),
  )

  return { ...hook, onPasswordSet }
}

describe("useNewPasswordForm", () => {
  it("does not reset the password when the confirmation differs", async () => {
    const { result } = await setup()

    await act(async () => {
      await fillForm(result.current.control, {
        newPassword: "12345678",
        confirmPassword: "different",
      })
      await result.current.submit()
    })

    expect(authClient.resetPassword).not.toHaveBeenCalled()
  })

  it("resets the password with the token and notifies the caller", async () => {
    authClient.resetPassword.mockResolvedValue({ error: null })
    const { result, onPasswordSet } = await setup()

    await act(async () => {
      await fillForm(result.current.control, matching)
      await result.current.submit()
    })

    expect(authClient.resetPassword).toHaveBeenCalledWith({
      token: "reset-token",
      newPassword: "12345678",
    })
    expect(toast.success).toHaveBeenCalledWith(translate("newPassword.success"))
    expect(onPasswordSet).toHaveBeenCalledTimes(1)
  })

  it("shows an error and does not notify when the reset fails", async () => {
    authClient.resetPassword.mockResolvedValue({
      error: { message: "Expired" },
    })
    const { result, onPasswordSet } = await setup()

    await act(async () => {
      await fillForm(result.current.control, matching)
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(translate("newPassword.error"))
    expect(onPasswordSet).not.toHaveBeenCalled()
  })
})
