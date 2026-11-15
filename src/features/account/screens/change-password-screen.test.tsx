import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { ChangePasswordScreen } from "./change-password-screen"

const fill = async (current: string, next: string, confirmation: string) => {
  await fireEvent.changeText(
    screen.getByLabelText(translate("account.password.current")),
    current,
  )
  await fireEvent.changeText(
    screen.getByLabelText(translate("account.password.new")),
    next,
  )
  await fireEvent.changeText(
    screen.getByLabelText(translate("account.password.confirm")),
    confirmation,
  )
}

const submit = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("account.password.submit") }),
  )

describe("ChangePasswordScreen", () => {
  it("shows the three password inputs", async () => {
    await renderWithProviders(
      <ChangePasswordScreen onPasswordChanged={jest.fn()} />,
    )

    expect(
      screen.getByLabelText(translate("account.password.current")),
    ).toBeOnTheScreen()
    expect(
      screen.getByLabelText(translate("account.password.new")),
    ).toBeOnTheScreen()
    expect(
      screen.getByLabelText(translate("account.password.confirm")),
    ).toBeOnTheScreen()
  })

  it("does not change the password when the confirmation differs", async () => {
    await renderWithProviders(
      <ChangePasswordScreen onPasswordChanged={jest.fn()} />,
    )

    await fill("old-secret", "12345678", "nope")
    await submit()

    expect(
      await screen.findByText(translate("validation.passwordMismatch")),
    ).toBeOnTheScreen()
    expect(authClient.changePassword).not.toHaveBeenCalled()
  })

  it("changes the password and notifies the caller", async () => {
    authClient.changePassword.mockResolvedValue({ error: null })
    const onPasswordChanged = jest.fn()
    await renderWithProviders(
      <ChangePasswordScreen onPasswordChanged={onPasswordChanged} />,
    )

    await fill("old-secret", "12345678", "12345678")
    await submit()

    await waitFor(() => expect(onPasswordChanged).toHaveBeenCalledTimes(1))
    expect(authClient.changePassword).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPassword: "old-secret",
        newPassword: "12345678",
      }),
    )
  })

  it("tells the user the current password is wrong", async () => {
    authClient.changePassword.mockResolvedValue({
      error: { code: "INVALID_PASSWORD" },
    })
    const onPasswordChanged = jest.fn()
    await renderWithProviders(
      <ChangePasswordScreen onPasswordChanged={onPasswordChanged} />,
    )

    await fill("wrong", "12345678", "12345678")
    await submit()

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        translate("account.password.invalidCurrent"),
      ),
    )
    expect(onPasswordChanged).not.toHaveBeenCalled()
  })
})
