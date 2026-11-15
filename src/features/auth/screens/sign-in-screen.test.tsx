import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { clearPendingCredentials } from "../utils/pending-credentials"
import { SignInScreen } from "./sign-in-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

beforeEach(clearPendingCredentials)

const handlers = () => ({
  onForgotPassword: jest.fn(),
  onCreateAccount: jest.fn(),
  onEmailNotVerified: jest.fn(),
})

const fillAndSubmit = async (
  email = "ana@example.com",
  password = "secret",
) => {
  await fireEvent.changeText(
    screen.getByLabelText(translate("signIn.email")),
    email,
  )
  await fireEvent.changeText(
    screen.getByLabelText(translate("signIn.password")),
    password,
  )
  await fireEvent.press(
    screen.getByRole("button", { name: translate("signIn.submit") }),
  )
}

describe("SignInScreen", () => {
  it("shows the title, the subtitle and both inputs", async () => {
    await renderWithProviders(<SignInScreen {...handlers()} />)

    expect(
      screen.getByRole("header", { name: translate("signIn.title") }),
    ).toBeOnTheScreen()
    expect(screen.getByLabelText(translate("signIn.email"))).toBeOnTheScreen()
    expect(
      screen.getByLabelText(translate("signIn.password")),
    ).toBeOnTheScreen()
  })

  it("goes to password recovery and to account creation", async () => {
    const props = handlers()
    await renderWithProviders(<SignInScreen {...props} />)

    await fireEvent.press(
      screen.getByRole("button", { name: translate("signIn.forgotPassword") }),
    )
    await fireEvent.press(
      screen.getByRole("button", { name: translate("signIn.createAccount") }),
    )

    expect(props.onForgotPassword).toHaveBeenCalledTimes(1)
    expect(props.onCreateAccount).toHaveBeenCalledTimes(1)
  })

  it("does not sign in with empty fields and shows the validation errors", async () => {
    await renderWithProviders(<SignInScreen {...handlers()} />)

    await fireEvent.press(
      screen.getByRole("button", { name: translate("signIn.submit") }),
    )

    expect(
      await screen.findByText(translate("validation.emailInvalid")),
    ).toBeOnTheScreen()
    expect(authClient.signIn.email).not.toHaveBeenCalled()
  })

  it("signs in with the typed credentials", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: { user: { emailVerified: true } },
      error: null,
    })
    await renderWithProviders(<SignInScreen {...handlers()} />)

    await fillAndSubmit()

    await waitFor(() =>
      expect(authClient.signIn.email).toHaveBeenCalledWith({
        email: "ana@example.com",
        password: "secret",
      }),
    )
  })

  it("shows an error when the credentials are wrong", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: null,
      error: { status: 401 },
    })
    await renderWithProviders(<SignInScreen {...handlers()} />)

    await fillAndSubmit()

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        translate("signIn.errors.invalidCredentials"),
      ),
    )
  })

  it("moves to verification when the email is not verified", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: { user: { emailVerified: false } },
      error: null,
    })
    apiClient.auth.sendVerificationOtp.mockResolvedValue(ok({}))
    const props = handlers()
    await renderWithProviders(<SignInScreen {...props} />)

    await fillAndSubmit()

    await waitFor(() =>
      expect(props.onEmailNotVerified).toHaveBeenCalledWith("ana@example.com"),
    )
  })

  it("starts the google sign in", async () => {
    authClient.signIn.social.mockResolvedValue({ error: null })
    await renderWithProviders(<SignInScreen {...handlers()} />)

    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("signIn.continueWithGoogle"),
      }),
    )

    await waitFor(() =>
      expect(authClient.signIn.social).toHaveBeenCalledWith(
        expect.objectContaining({ provider: "google" }),
      ),
    )
  })
})
