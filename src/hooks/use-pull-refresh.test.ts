import { act } from "@testing-library/react-native"

import { spyOnInvalidations } from "@/test/query-helpers"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { usePullRefresh } from "./use-pull-refresh"

describe("usePullRefresh", () => {
  it("is not refreshing at first", async () => {
    const { result } = await renderHookWithProviders(() =>
      usePullRefresh([["pets"]]),
    )

    expect(result.current.isRefreshing).toBe(false)
  })

  it("invalidates every key and stops refreshing", async () => {
    const { result, queryClient } = await renderHookWithProviders(() =>
      usePullRefresh([["pets"], ["agenda"], ["account"]]),
    )
    const invalidated = spyOnInvalidations(queryClient)

    await act(async () => {
      await result.current.onRefresh()
    })

    expect(invalidated()).toEqual([["pets"], ["agenda"], ["account"]])
    expect(result.current.isRefreshing).toBe(false)
  })

  it("shows the refreshing state until the invalidations finish", async () => {
    let finish: () => void = () => {}
    const { result, queryClient } = await renderHookWithProviders(() =>
      usePullRefresh([["pets"]]),
    )
    jest.spyOn(queryClient, "invalidateQueries").mockReturnValue(
      new Promise<void>((resolve) => {
        finish = resolve
      }),
    )

    let refresh: Promise<void> = Promise.resolve()
    await act(async () => {
      refresh = result.current.onRefresh()
    })
    expect(result.current.isRefreshing).toBe(true)

    await act(async () => {
      finish()
      await refresh
    })
    expect(result.current.isRefreshing).toBe(false)
  })

  it("stops refreshing even when an invalidation fails", async () => {
    const { result, queryClient } = await renderHookWithProviders(() =>
      usePullRefresh([["pets"]]),
    )
    jest
      .spyOn(queryClient, "invalidateQueries")
      .mockRejectedValue(new Error("boom"))

    await act(async () => {
      await result.current.onRefresh().catch(() => {})
    })

    expect(result.current.isRefreshing).toBe(false)
  })
})
