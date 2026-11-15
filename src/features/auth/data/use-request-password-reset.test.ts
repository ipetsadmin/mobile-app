import { act } from "@testing-library/react-native"

import { authClient } from "@/test/mocks/auth-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useRequestPasswordReset } from "./use-request-password-reset"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)
jest.mock("expo-linking", () => ({
  createURL: jest.fn((path: string) => `truffa://${path}`),
}))

describe("useRequestPasswordReset", () => {
  it("requests the reset with the trimmed email and a deep link to new-password", async () => {
    authClient.requestPasswordReset.mockResolvedValue({ error: null })
    const { result } = await renderHookWithProviders(() =>
      useRequestPasswordReset(),
    )

    await act(async () => {
      await result.current.mutateAsync({ email: " ana@example.com " })
    })

    expect(authClient.requestPasswordReset).toHaveBeenCalledWith({
      email: "ana@example.com",
      redirectTo: "truffa:///new-password",
    })
  })

  it("throws the error returned by the auth client", async () => {
    const error = { message: "Failed" }
    authClient.requestPasswordReset.mockResolvedValue({ error })
    const { result } = await renderHookWithProviders(() =>
      useRequestPasswordReset(),
    )

    await act(async () => {
      await expect(
        result.current.mutateAsync({ email: "ana@example.com" }),
      ).rejects.toBe(error)
    })
  })
})
