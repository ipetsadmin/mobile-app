import { act } from "@testing-library/react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useVerifyEmail } from "./use-verify-email"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

describe("useVerifyEmail", () => {
  it("verifies the email with the code against the API origin", async () => {
    apiClient.auth.verifyEmail.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() => useVerifyEmail())

    await act(async () => {
      await result.current.mutateAsync({
        email: "ana@example.com",
        otp: "123456",
      })
    })

    expect(apiClient.auth.verifyEmail).toHaveBeenCalledWith(
      process.env.EXPO_PUBLIC_API_URL ?? "",
      { email: "ana@example.com", otp: "123456" },
    )
  })

  it("surfaces an invalid code", async () => {
    apiClient.auth.verifyEmail.mockRejectedValue(new Error("Invalid code"))
    const { result } = await renderHookWithProviders(() => useVerifyEmail())

    await act(async () => {
      await expect(
        result.current.mutateAsync({ email: "ana@example.com", otp: "000000" }),
      ).rejects.toThrow("Invalid code")
    })
  })
})
