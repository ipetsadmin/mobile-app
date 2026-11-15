import { sessionState, testSession } from "@/test/mocks/session"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useAuthSession } from "./use-auth-session"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)

describe("useAuthSession", () => {
  it("exposes the current session", async () => {
    const { result } = await renderHookWithProviders(() => useAuthSession())

    expect(result.current.session).toEqual(testSession)
    expect(result.current.isPending).toBe(false)
  })

  it("has no session when signed out", async () => {
    sessionState.current = null

    const { result } = await renderHookWithProviders(() => useAuthSession())

    expect(result.current.session).toBeNull()
  })
})
