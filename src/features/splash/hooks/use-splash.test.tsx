import { act, renderHook } from "@testing-library/react-native"
import type { ReactNode } from "react"

import { SplashProvider } from "../components/splash-provider"
import { useSplash } from "./use-splash"

const wrapper = ({ children }: { children: ReactNode }) => (
  <SplashProvider>{children}</SplashProvider>
)

describe("useSplash", () => {
  it("is finished by default outside the provider", async () => {
    const { result } = await renderHook(() => useSplash())

    expect(result.current.isFinished).toBe(true)
  })

  it("starts unfinished inside the provider", async () => {
    const { result } = await renderHook(() => useSplash(), { wrapper })

    expect(result.current.isFinished).toBe(false)
  })

  it("finishes when asked", async () => {
    const { result } = await renderHook(() => useSplash(), { wrapper })

    await act(async () => {
      result.current.finish()
    })

    expect(result.current.isFinished).toBe(true)
  })
})
