import { act } from "@testing-library/react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { useResendCode } from "./use-resend-code"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

async function tick(seconds: number) {
  for (let second = 0; second < seconds; second++) {
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000)
    })
  }
}

describe("useResendCode", () => {
  it("starts without a cooldown", async () => {
    const { result } = await renderHookWithProviders(() =>
      useResendCode("ana@example.com"),
    )

    expect(result.current.secondsLeft).toBe(0)
  })

  it("sends a new code, confirms it and starts a 30 second cooldown", async () => {
    apiClient.auth.sendVerificationOtp.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() =>
      useResendCode("ana@example.com"),
    )

    await act(async () => {
      result.current.resend()
    })

    expect(apiClient.auth.sendVerificationOtp).toHaveBeenCalledWith(
      process.env.EXPO_PUBLIC_API_URL ?? "",
      "ana@example.com",
    )
    expect(toast.success).toHaveBeenCalledWith(
      translate("verifyAccount.resent"),
    )
    expect(result.current.secondsLeft).toBe(30)
  })

  it("counts the cooldown down one second at a time", async () => {
    apiClient.auth.sendVerificationOtp.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() =>
      useResendCode("ana@example.com"),
    )

    await act(async () => {
      result.current.resend()
    })
    await tick(3)

    expect(result.current.secondsLeft).toBe(27)
  })

  it("ignores a new request while the cooldown is running", async () => {
    apiClient.auth.sendVerificationOtp.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() =>
      useResendCode("ana@example.com"),
    )

    await act(async () => {
      result.current.resend()
    })
    await act(async () => {
      result.current.resend()
    })

    expect(apiClient.auth.sendVerificationOtp).toHaveBeenCalledTimes(1)
  })

  it("allows resending again once the cooldown ends", async () => {
    apiClient.auth.sendVerificationOtp.mockResolvedValue(ok({}))
    const { result } = await renderHookWithProviders(() =>
      useResendCode("ana@example.com"),
    )

    await act(async () => {
      result.current.resend()
    })
    await tick(30)
    await act(async () => {
      result.current.resend()
    })

    expect(apiClient.auth.sendVerificationOtp).toHaveBeenCalledTimes(2)
  })

  it("shows an error and starts no cooldown when sending fails", async () => {
    apiClient.auth.sendVerificationOtp.mockRejectedValue(
      new Error("Rate limited"),
    )
    const { result } = await renderHookWithProviders(() =>
      useResendCode("ana@example.com"),
    )

    await act(async () => {
      result.current.resend()
    })

    expect(toast.error).toHaveBeenCalledWith(translate("verifyAccount.error"))
    expect(result.current.secondsLeft).toBe(0)
  })
})
