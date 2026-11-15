import { act } from "@testing-library/react-native"

import { authClient } from "@/test/mocks/auth-client"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useSocialSignIn } from "./use-social-sign-in"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)

describe("useSocialSignIn", () => {
  it.each(["google", "apple"] as const)(
    "starts the %s sign in",
    async (provider) => {
      authClient.signIn.social.mockResolvedValue({ error: null })
      const { result } = await renderHookWithProviders(() => useSocialSignIn())

      await act(async () => {
        await result.current.mutateAsync(provider)
      })

      expect(authClient.signIn.social).toHaveBeenCalledWith({
        provider,
        callbackURL: "/",
      })
    },
  )

  it("throws the error returned by the auth client", async () => {
    const error = { message: "Cancelled" }
    authClient.signIn.social.mockResolvedValue({ error })
    const { result } = await renderHookWithProviders(() => useSocialSignIn())

    await act(async () => {
      await expect(result.current.mutateAsync("google")).rejects.toBe(error)
    })
  })
})
