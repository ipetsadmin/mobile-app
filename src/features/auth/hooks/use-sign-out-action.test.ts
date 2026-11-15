import { act } from "@testing-library/react-native"
import { Alert, type AlertButton } from "react-native"

import { authClient } from "@/test/mocks/auth-client"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { useSignOutAction } from "./use-sign-out-action"

jest.mock("@/lib/auth-client", () =>
  jest.requireActual("@/test/mocks/auth-client"),
)
jest.mock("sonner-native", () => jest.requireActual("@/test/mocks/toast"))

async function openConfirmation() {
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {})
  const { result } = await renderHookWithProviders(() => useSignOutAction())

  await act(async () => {
    result.current()
  })

  const [title, message, buttons] = alert.mock.calls[0]

  return { title, message, buttons: buttons as AlertButton[] }
}

describe("useSignOutAction", () => {
  it("asks for confirmation before signing out", async () => {
    const { title, message, buttons } = await openConfirmation()

    expect(title).toBe(translate("account.signOutConfirm.title"))
    expect(message).toBe(translate("account.signOutConfirm.message"))
    expect(buttons.map((button) => button.style)).toEqual([
      "cancel",
      "destructive",
    ])
    expect(authClient.signOut).not.toHaveBeenCalled()
  })

  it("signs out when the user confirms", async () => {
    authClient.signOut.mockResolvedValue({ error: null })
    const { buttons } = await openConfirmation()

    await act(async () => {
      buttons[1].onPress?.()
    })

    expect(authClient.signOut).toHaveBeenCalledTimes(1)
    expect(toast.error).not.toHaveBeenCalled()
  })

  it("does not sign out when the user cancels", async () => {
    const { buttons } = await openConfirmation()

    expect(buttons[0].onPress).toBeUndefined()
    expect(authClient.signOut).not.toHaveBeenCalled()
  })

  it("shows an error when signing out fails", async () => {
    authClient.signOut.mockResolvedValue({ error: { message: "Network" } })
    const { buttons } = await openConfirmation()

    await act(async () => {
      buttons[1].onPress?.()
    })

    expect(toast.error).toHaveBeenCalledWith(translate("account.signOutError"))
  })
})
