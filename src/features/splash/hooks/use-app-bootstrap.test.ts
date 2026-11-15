import { act, renderHook } from "@testing-library/react-native"
import { usePets } from "@/features/pets"
import { sessionState } from "@/test/mocks/session"

import { useAppBootstrap } from "./use-app-bootstrap"

jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)
jest.mock("@/features/pets", () => ({ usePets: jest.fn() }))

const petsAre = (state: "loading" | "loaded") =>
  jest
    .mocked(usePets)
    .mockReturnValue({ isPending: state === "loading" } as never)

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe("useAppBootstrap", () => {
  it("is not ready until the fonts are settled", async () => {
    petsAre("loaded")

    const { result } = await renderHook(() => useAppBootstrap(false))

    expect(result.current.isReady).toBe(false)
  })

  it("is ready right away without a session, even if the pets never load", async () => {
    sessionState.current = null
    petsAre("loading")

    const { result } = await renderHook(() => useAppBootstrap(true))

    expect(result.current).toEqual({ hasSession: false, isReady: true })
  })

  it("waits for the pets when there is a session", async () => {
    petsAre("loading")

    const { result } = await renderHook(() => useAppBootstrap(true))

    expect(result.current).toEqual({ hasSession: true, isReady: false })
  })

  it("is ready once the pets have loaded", async () => {
    petsAre("loaded")

    const { result } = await renderHook(() => useAppBootstrap(true))

    expect(result.current).toEqual({ hasSession: true, isReady: true })
  })

  it("becomes ready when the pets finish loading later", async () => {
    petsAre("loading")
    const { result, rerender } = await renderHook(() => useAppBootstrap(true))

    petsAre("loaded")
    await rerender({})

    expect(result.current.isReady).toBe(true)
  })

  it("stays ready after booting even if the pets reload", async () => {
    petsAre("loaded")
    const { result, rerender } = await renderHook(() => useAppBootstrap(true))

    petsAre("loading")
    await rerender({})

    expect(result.current.isReady).toBe(true)
  })

  it("gives up waiting for the pets after four seconds", async () => {
    petsAre("loading")
    const { result } = await renderHook(() => useAppBootstrap(true))

    await act(async () => {
      await jest.advanceTimersByTimeAsync(3999)
    })
    expect(result.current.isReady).toBe(false)

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1)
    })
    expect(result.current.isReady).toBe(true)
  })

  it("does not become ready by timeout while the fonts are not settled", async () => {
    petsAre("loading")
    const { result } = await renderHook(() => useAppBootstrap(false))

    await act(async () => {
      await jest.advanceTimersByTimeAsync(5000)
    })

    expect(result.current.isReady).toBe(false)
  })
})
