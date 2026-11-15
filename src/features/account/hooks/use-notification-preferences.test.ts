import { act, waitFor } from "@testing-library/react-native"
import { Linking } from "react-native"

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

import { useNotificationPreferences } from "./use-notification-preferences"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)
jest.mock("expo-notifications", () =>
  jest.requireActual("@/test/mocks/expo-notifications"),
)

const profile = (push: boolean, email: boolean) =>
  ok({
    profile: { firstName: "Ana", lastName: "Gomez" },
    preferences: { notifications: { push, email } },
  })

async function setup(push = false, email = true) {
  apiClient.users.getProfile.mockResolvedValue(profile(push, email))
  apiClient.users.patchPreferences.mockResolvedValue(ok({}))
  const hook = await renderHookWithProviders(() => useNotificationPreferences())
  await waitFor(() => expect(apiClient.users.getProfile).toHaveBeenCalled())

  return hook
}

describe("useNotificationPreferences", () => {
  it("reports push on only when the preference and the system permission agree", async () => {
    getPermissionsAsync.mockResolvedValue(granted)
    const { result } = await setup(true, true)

    await waitFor(() => expect(result.current.isPushOn).toBe(true))
  })

  it("reports push off when the system permission is missing", async () => {
    const { result } = await setup(true, true)

    expect(result.current.isPushOn).toBe(false)
  })

  it("flags a permission denied by the system", async () => {
    getPermissionsAsync.mockResolvedValue(denied)
    const { result } = await setup()

    await waitFor(() => expect(result.current.isPermissionDenied).toBe(true))
  })

  it("turns push off without asking for the permission", async () => {
    getPermissionsAsync.mockResolvedValue(granted)
    const { result } = await setup(true, false)

    await act(async () => {
      await result.current.setPush(false)
    })

    expect(requestPermissionsAsync).not.toHaveBeenCalled()
    expect(apiClient.users.patchPreferences).toHaveBeenCalledWith(
      "session-cookie",
      {
        notifications: { push: false, email: false },
      },
    )
  })

  it("turns push on directly when the permission is already granted", async () => {
    getPermissionsAsync.mockResolvedValue(granted)
    const { result } = await setup(false, true)
    await waitFor(() => expect(result.current.isPermissionDenied).toBe(false))

    await act(async () => {
      await result.current.setPush(true)
    })

    expect(requestPermissionsAsync).not.toHaveBeenCalled()
    expect(apiClient.users.patchPreferences).toHaveBeenCalledWith(
      "session-cookie",
      {
        notifications: { push: true, email: true },
      },
    )
  })

  it("asks for the permission first and saves when it is granted", async () => {
    requestPermissionsAsync.mockResolvedValue(granted)
    const { result } = await setup()

    await act(async () => {
      await result.current.setPush(true)
    })

    expect(requestPermissionsAsync).toHaveBeenCalledTimes(1)
    expect(apiClient.users.patchPreferences).toHaveBeenCalledWith(
      "session-cookie",
      {
        notifications: { push: true, email: true },
      },
    )
  })

  it("explains and does not save when the permission is refused", async () => {
    requestPermissionsAsync.mockResolvedValue(denied)
    const { result } = await setup()

    await act(async () => {
      await result.current.setPush(true)
    })

    expect(toast.error).toHaveBeenCalledWith(
      translate("account.notificationPreferences.denied"),
    )
    expect(apiClient.users.patchPreferences).not.toHaveBeenCalled()
  })

  it("saves the email preference keeping the push one", async () => {
    const { result } = await setup(false, true)

    await act(async () => {
      result.current.setEmail(false)
    })

    expect(apiClient.users.patchPreferences).toHaveBeenCalledWith(
      "session-cookie",
      {
        notifications: { push: false, email: false },
      },
    )
  })

  it("shows an error when saving fails", async () => {
    const { result } = await setup()
    apiClient.users.patchPreferences.mockRejectedValue(new Error("boom"))

    await act(async () => {
      result.current.setEmail(false)
    })

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        translate("account.notificationPreferences.error"),
      ),
    )
  })

  it("opens the system settings", async () => {
    const openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue()
    const { result } = await setup()

    result.current.openSettings()

    expect(openSettings).toHaveBeenCalledTimes(1)
  })
})
