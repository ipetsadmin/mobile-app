import { act, waitFor } from "@testing-library/react-native"
import { AppState } from "react-native"

import {
  denied,
  getPermissionsAsync,
  granted,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  undetermined,
} from "@/test/mocks/expo-notifications"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useNotificationPermission } from "./use-notification-permission"

describe("useNotificationPermission", () => {
  it("starts undetermined", async () => {
    const { result } = await renderHookWithProviders(() =>
      useNotificationPermission(),
    )

    expect(result.current.permission).toBe("undetermined")
  })

  it.each([
    [granted, "granted"],
    [denied, "denied"],
    [undetermined, "undetermined"],
  ])("reads the system status %#", async (status, expected) => {
    getPermissionsAsync.mockResolvedValue(status)

    const { result } = await renderHookWithProviders(() =>
      useNotificationPermission(),
    )

    await waitFor(() => expect(result.current.permission).toBe(expected))
  })

  it("refreshes the status when the app returns to the foreground", async () => {
    let onChange: (state: string) => void = () => {}
    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_type, listener) => {
        onChange = listener as (state: string) => void
        return { remove: jest.fn() }
      })
    const { result } = await renderHookWithProviders(() =>
      useNotificationPermission(),
    )
    getPermissionsAsync.mockResolvedValue(granted)

    await act(async () => {
      onChange("active")
    })

    await waitFor(() => expect(result.current.permission).toBe("granted"))
  })

  it("requests the permission without creating a channel outside android", async () => {
    requestPermissionsAsync.mockResolvedValue(granted)
    const { result } = await renderHookWithProviders(() =>
      useNotificationPermission(),
    )

    let status: string | undefined
    await act(async () => {
      status = await result.current.request()
    })

    expect(status).toBe("granted")
    expect(result.current.permission).toBe("granted")
    expect(setNotificationChannelAsync).not.toHaveBeenCalled()
  })

  it("reports a refusal as denied when the system will not ask again", async () => {
    requestPermissionsAsync.mockResolvedValue(denied)
    const { result } = await renderHookWithProviders(() =>
      useNotificationPermission(),
    )

    await act(async () => {
      await result.current.request()
    })

    expect(result.current.permission).toBe("denied")
  })
})
