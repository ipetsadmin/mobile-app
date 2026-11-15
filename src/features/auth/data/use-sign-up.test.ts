import { act } from "@testing-library/react-native"

import { authClient } from "@/test/mocks/auth-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useSignUp } from "./use-sign-up"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)

const values = {
  firstName: " Ana ",
  lastName: " Gomez ",
  email: " ana@example.com ",
  password: "12345678",
}

describe("useSignUp", () => {
  it("registers with trimmed values and the full name", async () => {
    authClient.signUp.email.mockResolvedValue({
      data: { user: {} },
      error: null,
    })
    const { result } = await renderHookWithProviders(() => useSignUp())

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    expect(authClient.signUp.email).toHaveBeenCalledWith({
      email: "ana@example.com",
      password: "12345678",
      name: "Ana Gomez",
      callbackURL: "/",
    })
  })

  it("throws the error returned by the auth client", async () => {
    const error = { status: 422 }
    authClient.signUp.email.mockResolvedValue({ data: null, error })
    const { result } = await renderHookWithProviders(() => useSignUp())

    await act(async () => {
      await expect(result.current.mutateAsync(values)).rejects.toBe(error)
    })
  })
})
