import { fireEvent, screen } from "@testing-library/react-native"

import { apiClient, ok } from "@/test/mocks/api-client"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { AccountSettings } from "./account-settings"

jest.mock("@/lib/api-client", () =>
  jest.requireActual("@/test/mocks/api-client"),
)
jest.mock("@/features/auth", () =>
  jest.requireActual("@/test/mocks/auth-feature"),
)

const profile = (push: boolean, email: boolean) =>
  ok({
    profile: { firstName: "Ana", lastName: "Gomez" },
    preferences: { notifications: { push, email } },
  })

describe("AccountSettings", () => {
  it("shows the email of the session and the current language", async () => {
    apiClient.users.getProfile.mockResolvedValue(profile(false, true))

    await renderWithProviders(<AccountSettings onOpen={jest.fn()} />)

    expect(
      screen.getByLabelText(translate("account.rows.email")),
    ).toHaveAccessibilityValue({
      text: "ana@example.com",
    })
    expect(
      screen.getByRole("button", { name: translate("account.rows.language") }),
    ).toHaveAccessibilityValue({
      text: translate("account.languages.es"),
    })
  })

  it("shows the household size", async () => {
    apiClient.users.getProfile.mockResolvedValue(profile(false, true))

    await renderWithProviders(<AccountSettings onOpen={jest.fn()} />)

    expect(
      screen.getByRole("button", { name: translate("account.rows.household") }),
    ).toHaveAccessibilityValue({
      text: translate("account.people", { count: 1 }),
    })
  })

  it("says notifications are on when push or email is enabled", async () => {
    apiClient.users.getProfile.mockResolvedValue(profile(false, true))

    await renderWithProviders(<AccountSettings onOpen={jest.fn()} />)

    expect(
      await screen.findByRole("button", {
        name: translate("account.rows.notifications"),
      }),
    ).toHaveAccessibilityValue({
      text: translate("account.notificationPreferences.on"),
    })
  })

  it("says notifications are off when both are disabled", async () => {
    apiClient.users.getProfile.mockResolvedValue(profile(false, false))

    await renderWithProviders(<AccountSettings onOpen={jest.fn()} />)

    expect(
      await screen.findByRole("button", {
        name: translate("account.rows.notifications"),
      }),
    ).toHaveAccessibilityValue({
      text: translate("account.notificationPreferences.off"),
    })
  })

  it.each([
    ["account.rows.password", "password"],
    ["account.rows.household", "household"],
    ["account.rows.notifications", "notifications"],
    ["account.rows.language", "language"],
  ])("opens the %s section", async (labelKey, section) => {
    apiClient.users.getProfile.mockResolvedValue(profile(false, true))
    const onOpen = jest.fn()
    await renderWithProviders(<AccountSettings onOpen={onOpen} />)

    await fireEvent.press(
      screen.getByRole("button", { name: translate(labelKey) }),
    )

    expect(onOpen).toHaveBeenCalledWith(section)
  })

  it("does not make the email row pressable", async () => {
    apiClient.users.getProfile.mockResolvedValue(profile(false, true))

    await renderWithProviders(<AccountSettings onOpen={jest.fn()} />)

    expect(
      screen.queryByRole("button", { name: translate("account.rows.email") }),
    ).not.toBeOnTheScreen()
  })
})
