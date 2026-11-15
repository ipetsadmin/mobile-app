import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { NewPasswordScreen } from "./new-password-screen"

const fill = async (password: string, confirmation: string) => {
  await fireEvent.changeText(
    screen.getByLabelText(translate("newPassword.password")),
    password,
  )
  await fireEvent.changeText(
    screen.getByLabelText(translate("newPassword.confirm")),
    confirmation,
  )
}

const submit = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("newPassword.submit") }),
  )

describe("NewPasswordScreen", () => {
  it("shows the title and both password inputs", async () => {
    await renderWithProviders(
      <NewPasswordScreen token="reset-token" onPasswordSet={jest.fn()} />,
    )

    expect(
      screen.getByRole("header", { name: translate("newPassword.title") }),
    ).toBeOnTheScreen()
    expect(
      screen.getByLabelText(translate("newPassword.password")),
    ).toBeOnTheScreen()
    expect(
      screen.getByLabelText(translate("newPassword.confirm")),
    ).toBeOnTheScreen()
  })

  it("does not reset the password when the confirmation differs", async () => {
    await renderWithProviders(
      <NewPasswordScreen token="reset-token" onPasswordSet={jest.fn()} />,
    )

    await fill("12345678", "87654321")
    await submit()

    expect(
      await screen.findByText(translate("validation.passwordMismatch")),
    ).toBeOnTheScreen()
    expect(authClient.resetPassword).not.toHaveBeenCalled()
  })

  it("sets the new password with the token and notifies the caller", async () => {
    authClient.resetPassword.mockResolvedValue({ error: null })
    const onPasswordSet = jest.fn()
    await renderWithProviders(
      <NewPasswordScreen token="reset-token" onPasswordSet={onPasswordSet} />,
    )

    await fill("12345678", "12345678")
    await submit()

    await waitFor(() => expect(onPasswordSet).toHaveBeenCalledTimes(1))
    expect(authClient.resetPassword).toHaveBeenCalledWith({
      token: "reset-token",
      newPassword: "12345678",
    })
    expect(toast.success).toHaveBeenCalledWith(translate("newPassword.success"))
  })

  it("shows an error when the token is rejected", async () => {
    authClient.resetPassword.mockResolvedValue({
      error: { message: "Expired" },
    })
    const onPasswordSet = jest.fn()
    await renderWithProviders(
      <NewPasswordScreen token="old-token" onPasswordSet={onPasswordSet} />,
    )

    await fill("12345678", "12345678")
    await submit()

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(translate("newPassword.error")),
    )
    expect(onPasswordSet).not.toHaveBeenCalled()
  })
})
