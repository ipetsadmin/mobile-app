import { act } from "@testing-library/react-native"

import { ApiError } from "@/lib/api-error"
import { authClient } from "@/test/mocks/auth-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useSignIn } from "./use-sign-in"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)

const values = { email: "  ana@example.com ", password: "secret" }

const verifiedSession = { data: { user: { emailVerified: true } }, error: null }

describe("useSignIn", () => {
  it("signs in with the trimmed email and the password", async () => {
    authClient.signIn.email.mockResolvedValue(verifiedSession)
    const { result } = await renderHookWithProviders(() => useSignIn())

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(authClient.signIn.email).toHaveBeenCalledWith({
      email: "ana@example.com",
      password: "secret",
    })
    expect(authClient.signOut).not.toHaveBeenCalled()
  })

  it("returns the session data", async () => {
    authClient.signIn.email.mockResolvedValue(verifiedSession)
    const { result } = await renderHookWithProviders(() => useSignIn())

    let data: unknown
    await act(async () => {
      data = await result.current.mutateAsync(values)
    })

    expect(data).toEqual(verifiedSession.data)
  })

  it("throws the error returned by the auth client", async () => {
    const error = { status: 401, message: "Invalid" }
    authClient.signIn.email.mockResolvedValue({ data: null, error })
    const { result } = await renderHookWithProviders(() => useSignIn())

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toBe(error)
    })
  })

  it("closes the session and throws 403 when the email is not verified", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: { user: { emailVerified: false } },
      error: null,
    })
    const { result } = await renderHookWithProviders(() => useSignIn())

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toMatchObject({
        status: 403,
        message: "EMAIL_NOT_VERIFIED",
      })
    })

    expect(authClient.signOut).toHaveBeenCalledTimes(1)
  })

  it("throws an ApiError for an unverified email", async () => {
    authClient.signIn.email.mockResolvedValue({
      data: { user: { emailVerified: false } },
      error: null,
    })
    const { result } = await renderHookWithProviders(() => useSignIn())

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toBeInstanceOf(
        ApiError,
      )
    })
  })
})
