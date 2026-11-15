import { act } from "@testing-library/react-native"

import { fillForm } from "@/test/fill-form"
import { apiClient, ok } from "@/test/mocks/api-client"
import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import {
  clearPendingCredentials,
  getPendingPassword,
} from "../utils/pending-credentials"
import { useSignInForm } from "./use-sign-in-form"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)
jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("sonner-native", () => jest.requireActual("@/test/mocks/toast"))

beforeEach(clearPendingCredentials)

const credentials = { email: "ana@example.com", password: "secret" }

async function setup() {
  const onEmailNotVerified = jest.fn()
  const hook = await renderHookWithProviders(() =>
    useSignInForm({ onEmailNotVerified }),
  )

  return { ...hook, onEmailNotVerified }
}

describe("useSignInForm", () => {
  it("does not call the API while the form is invalid", async () => {
    const { result } = await setup()

    await act(async () => {
      await result.current.submit()
    })

    expect(authClient.signIn.email).not.toHaveBeenCalled()
  })

  it("signs in with the typed credentials", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: { user: { emailVerified: true } },
      error: null,
    })
    const { result, onEmailNotVerified } = await setup()

    await act(async () => {
      await fillForm(result.current.control, credentials)
      await result.current.submit()
    })

    expect(authClient.signIn.email).toHaveBeenCalledWith(credentials)
    expect(toast.error).not.toHaveBeenCalled()
    expect(onEmailNotVerified).not.toHaveBeenCalled()
  })

  it("shows the invalid credentials message on 401", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: null,
      error: { status: 401 },
    })
    const { result } = await setup()

    await act(async () => {
      await fillForm(result.current.control, credentials)
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(
      translate("signIn.errors.invalidCredentials"),
    )
  })

  it("shows the generic message for any other error", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: null,
      error: { status: 500 },
    })
    const { result } = await setup()

    await act(async () => {
      await fillForm(result.current.control, credentials)
      await result.current.submit()
    })

    expect(toast.error).toHaveBeenCalledWith(translate("signIn.errors.generic"))
  })

  it("sends a code and moves to verification when the email is not verified", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: { user: { emailVerified: false } },
      error: null,
    })
    apiClient.auth.sendVerificationOtp.mockResolvedValue(ok({}))
    const { result, onEmailNotVerified } = await setup()

    await act(async () => {
      await fillForm(result.current.control, credentials)
      await result.current.submit()
    })

    expect(onEmailNotVerified).toHaveBeenCalledWith("ana@example.com")
    expect(apiClient.auth.sendVerificationOtp).toHaveBeenCalledWith(
      process.env.EXPO_PUBLIC_API_URL ?? "",
      "ana@example.com",
    )
    expect(getPendingPassword("ana@example.com")).toBe("secret")
    expect(toast.error).not.toHaveBeenCalled()
  })

  it("starts the social sign in for the chosen provider", async () => {
    authClient.signIn.social.mockResolvedValue({ error: null })
    const { result } = await setup()

    await act(async () => {
      result.current.continueWith("google")
    })

    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/",
    })
  })

  it("shows an error when the social sign in fails", async () => {
    authClient.signIn.social.mockResolvedValue({ error: { status: 500 } })
    const { result } = await setup()

    await act(async () => {
      result.current.continueWith("apple")
    })

    expect(toast.error).toHaveBeenCalledWith(translate("signIn.errors.generic"))
  })
})
