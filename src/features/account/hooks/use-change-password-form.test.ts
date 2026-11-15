import { act } from "@testing-library/react-native"

import { fillForm } from "@/test/fill-form"
import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { useChangePasswordForm } from "./use-change-password-form"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)
jest.mock("sonner-native", () => jest.requireActual("@/test/mocks/toast"))

const values = {
  currentPassword: "old-secret",
  newPassword: "12345678",
  confirmPassword: "12345678",
}

async function setup() {
  const onPasswordChanged = jest.fn()
  const hook = await renderHookWithProviders(() =>
    useChangePasswordForm({ onPasswordChanged }),
  )

  return { ...hook, onPasswordChanged }
}

describe("useChangePasswordForm", () => {
  it("does not change the password when the confirmation differs", async () => {
    const { result } = await setup()

    await act(async () => {
      await fillForm(result.current.control, {
        ...values,
        confirmPassword: "nope",
      })
      await result.current.submit()
    })

    expect(authClient.changePassword).not.toHaveBeenCalled()
  })

  it("changes the password and notifies the caller", async () => {
    authClient.changePassword.mockResolvedValue({ error: null })
    const { result, onPasswordChanged } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(authClient.changePassword).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPassword: "old-secret",
        newPassword: "12345678",
      }),
    )
    expect(onPasswordChanged).toHaveBeenCalledTimes(1)
  })

  it("tells the user the current password is wrong", async () => {
    authClient.changePassword.mockResolvedValue({
      error: { code: "INVALID_PASSWORD" },
    })
    const { result, onPasswordChanged } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(
      translate("account.password.invalidCurrent"),
    )
    expect(onPasswordChanged).not.toHaveBeenCalled()
  })

  it("shows a generic message for any other error", async () => {
    authClient.changePassword.mockResolvedValue({ error: { code: "OTHER" } })
    const { result } = await setup()

    await act(async () => {
      await fillForm(result.current.control, values)
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(
      translate("account.password.genericError"),
    )
  })
})
