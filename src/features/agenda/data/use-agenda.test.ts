import { waitFor } from "@testing-library/react-native"

import { queryKeys } from "@/constants/query-keys"
import { makeDoseItem } from "@/test/factories/make-agenda-item"
import { apiClient, ok } from "@/test/mocks/api-client"
import { sessionState } from "@/test/mocks/session"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useAgenda } from "./use-agenda"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const response = (items: unknown[]) => ok({ items })

describe("useAgenda", () => {
  it("requests the agenda for the given number of days", async () => {
    apiClient.users.getAgenda.mockResolvedValue(response([]))

    const { result } = await renderHookWithProviders(() => useAgenda(7))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiClient.users.getAgenda).toHaveBeenCalledWith("session-cookie", 7)
  })

  it("returns the items sorted by date with real Date objects", async () => {
    const late = makeDoseItem({
      occursAt: "2026-06-20T10:00:00.000Z" as unknown as Date,
    })
    const early = makeDoseItem({
      occursAt: "2026-06-16T10:00:00.000Z" as unknown as Date,
    })
    apiClient.users.getAgenda.mockResolvedValue(response([late, early]))

    const { result } = await renderHookWithProviders(() => useAgenda(30))

    await waitFor(() => expect(result.current.data).toHaveLength(2))
    expect(
      result.current.data?.map((item) => item.occursAt.toISOString()),
    ).toEqual(["2026-06-16T10:00:00.000Z", "2026-06-20T10:00:00.000Z"])
  })

  it("returns an empty list when the response has no items", async () => {
    apiClient.users.getAgenda.mockResolvedValue(ok(undefined))

    const { result } = await renderHookWithProviders(() => useAgenda(7))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })

  it("keeps a separate cache entry per number of days", async () => {
    apiClient.users.getAgenda.mockResolvedValue(response([]))

    const { result, queryClient } = await renderHookWithProviders(() =>
      useAgenda(7),
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      queryClient.getQueryData(queryKeys.agenda.list("user-1", 7)),
    ).toBeDefined()
    expect(
      queryClient.getQueryData(queryKeys.agenda.list("user-1", 30)),
    ).toBeUndefined()
  })

  it("does not fetch without a session", async () => {
    sessionState.current = null

    const { result } = await renderHookWithProviders(() => useAgenda(7))

    expect(result.current.fetchStatus).toBe("idle")
    expect(apiClient.users.getAgenda).not.toHaveBeenCalled()
  })
})
