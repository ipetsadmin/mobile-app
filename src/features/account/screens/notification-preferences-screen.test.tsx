import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { Linking } from "react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import {
  denied,
  getPermissionsAsync,
  granted,
} from "@/test/mocks/expo-notifications"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { NotificationPreferencesScreen } from "./notification-preferences-screen"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)

const profile = (push: boolean, email: boolean) =>
  ok({
    profile: { firstName: "Ana", lastName: "Gomez" },
    preferences: { notifications: { push, email } },
  })

const setup = async (push: boolean, email: boolean) => {
  apiClient.users.getProfile.mockResolvedValue(profile(push, email))
  apiClient.users.patchPreferences.mockResolvedValue(ok({}))
  await renderWithProviders(<NotificationPreferencesScreen />)
  await waitFor(() => expect(apiClient.users.getProfile).toHaveBeenCalled())
}

describe("NotificationPreferencesScreen", () => {
  it("shows the push and the email channels with their hints", async () => {
    await setup(false, true)

    expect(
      screen.getByText(translate("account.notificationPreferences.push")),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("account.notificationPreferences.pushHint")),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("account.notificationPreferences.email")),
    ).toBeOnTheScreen()
    expect(
      screen.getByText(translate("account.notificationPreferences.emailHint")),
    ).toBeOnTheScreen()
    expect(screen.getAllByRole("switch")).toHaveLength(2)
  })

  it("reflects the saved email preference", async () => {
    await setup(false, true)

    await waitFor(() => expect(screen.getAllByRole("switch")[1]).toBeChecked())
    expect(screen.getAllByRole("switch")[0]).not.toBeChecked()
  })

  it("saves the email preference when toggled", async () => {
    await setup(false, true)

    await fireEvent.press(screen.getAllByRole("switch")[1])

    await waitFor(() =>
      expect(apiClient.users.patchPreferences).toHaveBeenCalledWith(
        "session-cookie",
        {
          notifications: { push: false, email: false },
        },
      ),
    )
  })

  it("does not warn about the permission while it is not denied", async () => {
    await setup(false, true)

    expect(
      screen.queryByText(
        translate("account.notificationPreferences.openSettings"),
      ),
    ).not.toBeOnTheScreen()
  })

  it("explains the denied permission and opens the system settings", async () => {
    getPermissionsAsync.mockResolvedValue(denied)
    const openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue()
    await setup(false, true)

    await fireEvent.press(
      await screen.findByRole("button", {
        name: translate("account.notificationPreferences.openSettings"),
      }),
    )

    expect(openSettings).toHaveBeenCalledTimes(1)
  })

  it("turns push on directly when the permission is already granted", async () => {
    getPermissionsAsync.mockResolvedValue(granted)
    await setup(false, true)

    await fireEvent.press(screen.getAllByRole("switch")[0])

    await waitFor(() =>
      expect(apiClient.users.patchPreferences).toHaveBeenCalledWith(
        "session-cookie",
        {
          notifications: { push: true, email: true },
        },
      ),
    )
  })
})
