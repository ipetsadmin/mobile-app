import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { clearPendingCredentials } from "../utils/pending-credentials"
import { SignUpScreen } from "./sign-up-screen"

beforeEach(clearPendingCredentials)

const fill = async (overrides: Record<string, string> = {}) => {
  const values = {
    "signUp.firstName": "Ana",
    "signUp.lastName": "Gomez",
    "signUp.email": "ana@example.com",
    "signUp.password": "12345678",
    ...overrides,
  }

  for (const [key, value] of Object.entries(values)) {
    await fireEvent.changeText(screen.getByLabelText(translate(key)), value)
  }
}

const submit = () =>
  fireEvent.press(
    screen.getByRole("button", { name: translate("signUp.submit") }),
  )

describe("SignUpScreen", () => {
  it("shows the title and the four fields", async () => {
    await renderWithProviders(<SignUpScreen onSignedUp={jest.fn()} />)

    expect(
      screen.getByRole("header", { name: translate("signUp.title") }),
    ).toBeOnTheScreen()
    for (const key of [
      "signUp.firstName",
      "signUp.lastName",
      "signUp.email",
      "signUp.password",
    ]) {
      expect(screen.getByLabelText(translate(key))).toBeOnTheScreen()
    }
  })

  it("does not register with empty fields", async () => {
    await renderWithProviders(<SignUpScreen onSignedUp={jest.fn()} />)

    await submit()

    expect(
      await screen.findAllByText(translate("validation.required")),
    ).not.toHaveLength(0)
    expect(authClient.signUp.email).not.toHaveBeenCalled()
  })

  it("rejects a short password", async () => {
    await renderWithProviders(<SignUpScreen onSignedUp={jest.fn()} />)

    await fill({ "signUp.password": "123" })
    await submit()

    expect(
      await screen.findByText(translate("validation.passwordTooShort")),
    ).toBeOnTheScreen()
    expect(authClient.signUp.email).not.toHaveBeenCalled()
  })

  it("registers and moves on to verification with the email", async () => {
    authClient.signUp.email.mockResolvedValue({ data: {}, error: null })
    const onSignedUp = jest.fn()
    await renderWithProviders(<SignUpScreen onSignedUp={onSignedUp} />)

    await fill()
    await submit()

    await waitFor(() =>
      expect(onSignedUp).toHaveBeenCalledWith("ana@example.com"),
    )
    expect(authClient.signUp.email).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Ana Gomez", email: "ana@example.com" }),
    )
  })

  it("tells the user when the email is already registered", async () => {
    authClient.signUp.email.mockResolvedValue({
      data: null,
      error: { status: 422 },
    })
    const onSignedUp = jest.fn()
    await renderWithProviders(<SignUpScreen onSignedUp={onSignedUp} />)

    await fill()
    await submit()

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        translate("signUp.errors.emailTaken"),
      ),
    )
    expect(onSignedUp).not.toHaveBeenCalled()
  })
})
