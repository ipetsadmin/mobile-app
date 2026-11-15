import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { ResetPasswordScreen } from "./reset-password-screen"

jest.mock("expo-linking", () => ({
  createURL: jest.fn((path: string) => `truffa://${path}`),
}))

const submit = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("resetPassword.submit") }),
  )

describe("ResetPasswordScreen", () => {
  it("shows the title and the email input", async () => {
    await renderWithProviders(<ResetPasswordScreen onRequested={jest.fn()} />)

    expect(
      screen.getByRole("header", { name: translate("resetPassword.title") }),
    ).toBeOnTheScreen()
    expect(
      screen.getByLabelText(translate("resetPassword.email")),
    ).toBeOnTheScreen()
  })

  it("does not request a reset for an invalid email", async () => {
    await renderWithProviders(<ResetPasswordScreen onRequested={jest.fn()} />)

    await fireEvent.changeText(
      screen.getByLabelText(translate("resetPassword.email")),
      "ana",
    )
    await submit()

    expect(
      await screen.findByText(translate("validation.emailInvalid")),
    ).toBeOnTheScreen()
    expect(authClient.requestPasswordReset).not.toHaveBeenCalled()
  })

  it("requests the reset, confirms it and notifies the caller", async () => {
    authClient.requestPasswordReset.mockResolvedValue({ error: null })
    const onRequested = jest.fn()
    await renderWithProviders(<ResetPasswordScreen onRequested={onRequested} />)

    await fireEvent.changeText(
      screen.getByLabelText(translate("resetPassword.email")),
      "ana@example.com",
    )
    await submit()

    await waitFor(() => expect(onRequested).toHaveBeenCalledTimes(1))
    expect(toast.success).toHaveBeenCalledWith(translate("resetPassword.sent"))
  })

  it("shows an error when the request fails", async () => {
    authClient.requestPasswordReset.mockResolvedValue({
      error: { message: "x" },
    })
    const onRequested = jest.fn()
    await renderWithProviders(<ResetPasswordScreen onRequested={onRequested} />)

    await fireEvent.changeText(
      screen.getByLabelText(translate("resetPassword.email")),
      "ana@example.com",
    )
    await submit()

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        translate("resetPassword.error"),
      ),
    )
    expect(onRequested).not.toHaveBeenCalled()
  })
})
