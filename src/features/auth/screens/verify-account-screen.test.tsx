import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import {
  clearPendingCredentials,
  setPendingCredentials,
} from "../utils/pending-credentials"
import { VerifyAccountScreen } from "./verify-account-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const email = "ana@example.com"

beforeEach(clearPendingCredentials)

const enterCode = async (code: string) => {
  await fireEvent.changeText(
    screen.getByLabelText(translate("verifyAccount.code")),
    code,
  )
  await fireEvent.press(
    screen.getByRole("button", { name: translate("verifyAccount.submit") }),
  )
}

describe("VerifyAccountScreen", () => {
  it("shows the title with the email and the code input", async () => {
    await renderWithProviders(
      <VerifyAccountScreen email={email} onGoToSignIn={jest.fn()} />,
    )

    expect(
      screen.getByRole("header", { name: translate("verifyAccount.title") }),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("verifyAccount.subtitle", { email })),
    ).toBeOnTheScreen()
    expect(
      screen.getByLabelText(translate("verifyAccount.code")),
    ).toBeOnTheScreen()
  })

  it("does not verify an incomplete code", async () => {
    await renderWithProviders(
      <VerifyAccountScreen email={email} onGoToSignIn={jest.fn()} />,
    )

    await enterCode("123")

    expect(apiClient.auth.verifyEmail).not.toHaveBeenCalled()
  })

  it("verifies the code and signs in with the remembered password", async () => {
    apiClient.auth.verifyEmail.mockResolvedValue(ok({}))
    authClient.signIn.email.mockResolvedValue({
      data: { user: { emailVerified: true } },
      error: null,
    })
    setPendingCredentials(email, "secret")
    await renderWithProviders(
      <VerifyAccountScreen email={email} onGoToSignIn={jest.fn()} />,
    )

    await enterCode("123456")

    await waitFor(() =>
      expect(authClient.signIn.email).toHaveBeenCalledWith({
        email,
        password: "secret",
      }),
    )
    expect(toast.success).toHaveBeenCalledWith(
      translate("verifyAccount.verified"),
    )
  })

  it("shows an error for a wrong code", async () => {
    apiClient.auth.verifyEmail.mockRejectedValue(new Error("Invalid"))
    await renderWithProviders(
      <VerifyAccountScreen email={email} onGoToSignIn={jest.fn()} />,
    )

    await enterCode("000000")

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        translate("verifyAccount.errors.invalidCode"),
      ),
    )
  })

  it("goes back to sign in", async () => {
    const onGoToSignIn = jest.fn()
    await renderWithProviders(
      <VerifyAccountScreen email={email} onGoToSignIn={onGoToSignIn} />,
    )

    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("verifyAccount.goToSignIn"),
      }),
    )

    expect(onGoToSignIn).toHaveBeenCalledTimes(1)
  })

  it("resends the code and shows the cooldown", async () => {
    apiClient.auth.sendVerificationOtp.mockResolvedValue(ok({}))
    await renderWithProviders(
      <VerifyAccountScreen email={email} onGoToSignIn={jest.fn()} />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("verifyAccount.resend") }),
    )

    expect(
      await screen.findByRole("button", {
        name: translate("verifyAccount.resendIn", { seconds: 30 }),
      }),
    ).toBeOnTheScreen()
    expect(apiClient.auth.sendVerificationOtp).toHaveBeenCalledWith(
      process.env.EXPO_PUBLIC_API_URL ?? "",
      email,
    )
  })
})
