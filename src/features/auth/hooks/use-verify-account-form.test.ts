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
  setPendingCredentials,
} from "../utils/pending-credentials"
import { useVerifyAccountForm } from "./use-verify-account-form"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)

beforeEach(clearPendingCredentials)

const email = "ana@example.com"

async function setup() {
  const onGoToSignIn = jest.fn()
  const hook = await renderHookWithProviders(() =>
    useVerifyAccountForm({ email, onGoToSignIn }),
  )

  return { ...hook, onGoToSignIn }
}

async function submitCode(
  hook: Awaited<ReturnType<typeof setup>>,
  code = "123456",
) {
  await act(async () => {
    await fillForm(hook.result.current.control, { code })
    await hook.result.current.submit()
  })
}

beforeEach(() => {
  authClient.signIn.email.mockResolvedValue({
    data: { user: { emailVerified: true } },
    error: null,
  })
})

describe("useVerifyAccountForm", () => {
  it("does not verify an invalid code", async () => {
    const hook = await setup()

    await submitCode(hook, "123")

    expect(apiClient.auth.verifyEmail).not.toHaveBeenCalled()
  })

  it("verifies the code and signs in with the remembered password", async () => {
    apiClient.auth.verifyEmail.mockResolvedValue(ok({}))
    setPendingCredentials(email, "secret")
    const hook = await setup()

    await submitCode(hook)

    expect(apiClient.auth.verifyEmail).toHaveBeenCalledWith(
      process.env.EXPO_PUBLIC_API_URL ?? "",
      { email, otp: "123456" },
    )
    expect(toast.success).toHaveBeenCalledWith(
      translate("verifyAccount.verified"),
    )
    expect(authClient.signIn.email).toHaveBeenCalledWith({
      email,
      password: "secret",
    })
    expect(getPendingPassword(email)).toBeUndefined()
  })

  it("sends the user to sign in when the password was not remembered", async () => {
    apiClient.auth.verifyEmail.mockResolvedValue(ok({}))
    const hook = await setup()

    await submitCode(hook)

    expect(authClient.signIn.email).not.toHaveBeenCalled()
    expect(hook.onGoToSignIn).toHaveBeenCalledTimes(1)
  })

  it("shows an error for an invalid code and does not sign in", async () => {
    apiClient.auth.verifyEmail.mockRejectedValue(new Error("Invalid"))
    setPendingCredentials(email, "secret")
    const hook = await setup()

    await submitCode(hook)

    expect(toast.error).toHaveBeenCalledWith(
      translate("verifyAccount.errors.invalidCode"),
    )
    expect(authClient.signIn.email).not.toHaveBeenCalled()
    expect(getPendingPassword(email)).toBe("secret")
  })

  it("forgets the password and shows an error when the automatic sign in fails", async () => {
    apiClient.auth.verifyEmail.mockResolvedValue(ok({}))
    authClient.signIn.email.mockResolvedValue({
      data: null,
      error: { status: 401 },
    })
    setPendingCredentials(email, "secret")
    const hook = await setup()

    await submitCode(hook)

    expect(toast.error).toHaveBeenCalledWith(
      translate("verifyAccount.errors.signIn"),
    )
    expect(getPendingPassword(email)).toBeUndefined()
  })

  it("does not verify twice: a second submit only retries the sign in", async () => {
    apiClient.auth.verifyEmail.mockResolvedValue(ok({}))
    authClient.signIn.email.mockResolvedValueOnce({
      data: null,
      error: { status: 500 },
    })
    setPendingCredentials(email, "secret")
    const hook = await setup()

    await submitCode(hook)
    setPendingCredentials(email, "secret")
    await submitCode(hook)

    expect(apiClient.auth.verifyEmail).toHaveBeenCalledTimes(1)
    expect(authClient.signIn.email).toHaveBeenCalledTimes(2)
  })

  it("goToSignIn forgets the password and notifies the caller", async () => {
    setPendingCredentials(email, "secret")
    const hook = await setup()

    await act(async () => {
      hook.result.current.goToSignIn()
    })

    expect(getPendingPassword(email)).toBeUndefined()
    expect(hook.onGoToSignIn).toHaveBeenCalledTimes(1)
  })
})
