import AsyncStorage from "@react-native-async-storage/async-storage"
import { act, waitFor } from "@testing-library/react-native"
import { Alert, type AlertButton } from "react-native"

import { hasAnsweredPushPrompt } from "@/lib/push-prompt-storage"
import { apiClient, ok } from "@/test/mocks/api-client"
import {
  denied,
  getPermissionsAsync,
  granted,
  requestPermissionsAsync,
} from "@/test/mocks/expo-notifications"
import { toast } from "@/test/mocks/toast"
import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { usePushPrompt } from "./use-push-prompt"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("expo-notifications", () =>
  jest.requireActual("@/test/mocks/expo-notifications"),
)

let alert: jest.SpyInstance

beforeEach(async () => {
  await AsyncStorage.clear()
  alert = jest.spyOn(Alert, "alert").mockImplementation(() => {})
})

async function render(isEnabled = true, isEmailOn = true) {
  const hook = await renderHookWithProviders(() =>
    usePushPrompt({ isEnabled, isEmailOn }),
  )

  return hook
}

const buttons = () => alert.mock.calls[0][2] as AlertButton[]

describe("usePushPrompt", () => {
  it("asks once when enabled, undetermined and never answered", async () => {
    await render()

    await waitFor(() => expect(alert).toHaveBeenCalledTimes(1))
    expect(alert.mock.calls[0][0]).toBe(
      translate("notifications.pushPrompt.title"),
    )
  })

  it("does not ask while it is disabled", async () => {
    await render(false)

    await act(async () => {})
    expect(alert).not.toHaveBeenCalled()
  })

  it.failing("does not ask when the permission was already decided", async () => {
    getPermissionsAsync.mockResolvedValue(granted)

    await render()

    await act(async () => {})
    expect(alert).not.toHaveBeenCalled()
  })

  it("does not ask again after the user answered", async () => {
    await AsyncStorage.setItem("push-prompt-answered", "true")

    await render()

    await act(async () => {})
    expect(alert).not.toHaveBeenCalled()
  })

  it("remembers the answer when the user chooses later", async () => {
    await render()
    await waitFor(() => expect(alert).toHaveBeenCalled())

    await act(async () => {
      await buttons()[0].onPress?.()
    })

    expect(await hasAnsweredPushPrompt()).toBe(true)
    expect(requestPermissionsAsync).not.toHaveBeenCalled()
  })

  it("requests the permission and turns push on when allowed", async () => {
    requestPermissionsAsync.mockResolvedValue(granted)
    apiClient.users.patchPreferences.mockResolvedValue(ok({}))
    await render(true, false)
    await waitFor(() => expect(alert).toHaveBeenCalled())

    await act(async () => {
      await buttons()[1].onPress?.()
    })

    expect(await hasAnsweredPushPrompt()).toBe(true)
    expect(apiClient.users.patchPreferences).toHaveBeenCalledWith(
      "session-cookie",
      {
        notifications: { push: true, email: false },
      },
    )
  })

  it("does not save preferences when the system denies the permission", async () => {
    requestPermissionsAsync.mockResolvedValue(denied)
    await render()
    await waitFor(() => expect(alert).toHaveBeenCalled())

    await act(async () => {
      await buttons()[1].onPress?.()
    })

    expect(apiClient.users.patchPreferences).not.toHaveBeenCalled()
  })

  it("shows an error when saving the preference fails", async () => {
    requestPermissionsAsync.mockResolvedValue(granted)
    apiClient.users.patchPreferences.mockRejectedValue(new Error("boom"))
    await render()
    await waitFor(() => expect(alert).toHaveBeenCalled())

    await act(async () => {
      await buttons()[1].onPress?.()
    })

    expect(toast.error).toHaveBeenCalledWith(
      translate("notifications.pushPrompt.error"),
    )
  })
})
