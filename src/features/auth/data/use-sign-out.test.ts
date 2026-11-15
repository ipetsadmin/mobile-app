import { act } from "@testing-library/react-native"

import { authClient } from "@/test/mocks/auth-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import {
  getPendingPassword,
  setPendingCredentials,
} from "../utils/pending-credentials"
import { useSignOut } from "./use-sign-out"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)

describe("useSignOut", () => {
  it("signs out, forgets pending credentials and clears the cache", async () => {
    authClient.signOut.mockResolvedValue({ error: null })
    setPendingCredentials("ana@example.com", "secret")
    const { result, queryClient } = await renderHookWithProviders(() =>
      useSignOut(),
    )
    queryClient.setQueryData(["pets"], [1])

    await act(async () => {
      await result.current.mutateAsync()
    })

    expect(authClient.signOut).toHaveBeenCalledTimes(1)
    expect(getPendingPassword("ana@example.com")).toBeUndefined()
    expect(queryClient.getQueryData(["pets"])).toBeUndefined()
  })

  it("keeps the cache and the credentials when signing out fails", async () => {
    const error = { message: "Network" }
    authClient.signOut.mockResolvedValue({ error })
    setPendingCredentials("ana@example.com", "secret")
    const { result, queryClient } = await renderHookWithProviders(() =>
      useSignOut(),
    )
    queryClient.setQueryData(["pets"], [1])

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toBe(error)
    })

    expect(getPendingPassword("ana@example.com")).toBe("secret")
    expect(queryClient.getQueryData(["pets"])).toEqual([1])
  })
})
