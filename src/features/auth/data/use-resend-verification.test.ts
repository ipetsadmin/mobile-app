import { act } from "@testing-library/react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useResendVerification } from "./use-resend-verification"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

describe("useResendVerification", () => {
  it("sends a new code to the email", async () => {
    apiClient.auth.sendVerificationOtp.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() =>
      useResendVerification(),
    )

    await act(async () => {
      await result.current.mutateAsync("ana@example.com")
    })

    expect(apiClient.auth.sendVerificationOtp).toHaveBeenCalledWith(
      process.env.EXPO_PUBLIC_API_URL ?? "",
      "ana@example.com",
    )
  })

  it("surfaces API errors", async () => {
    apiClient.auth.sendVerificationOtp.mockRejectedValue(
      new Error("Rate limited"),
    )
    const { result } = await renderHookWithProviders(() =>
      useResendVerification(),
    )

    await act(async () => {
      await expect(
        result.current.mutateAsync("ana@example.com"),
      ).rejects.toThrow("Rate limited")
    })
  })
})
