import AsyncStorage from "@react-native-async-storage/async-storage"
import { fireEvent, screen } from "@testing-library/react-native"

import { AppThemeProvider } from "@/providers/theme-provider"
import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { AppearanceSetting } from "./appearance-setting"

beforeEach(() => AsyncStorage.clear())

const renderSetting = (preference: "light" | "dark" | "exploratory") =>
  renderWithProviders(
    <AppThemeProvider initialPreference={preference}>
      <AppearanceSetting />
    </AppThemeProvider>,
  )

describe("AppearanceSetting", () => {
  it("offers the three themes under the appearance label", async () => {
    await renderSetting("light")

    expect(
      screen.getByText(`${translate("account.appearance.label")} ·`),
    ).toBeOnTheScreen()
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("marks the active theme", async () => {
    await renderSetting("dark")

    expect(
      screen.getByRole("radio", { name: translate("account.appearance.dark") }),
    ).toBeSelected()
    expect(
      screen.getByRole("radio", {
        name: translate("account.appearance.light"),
      }),
    ).not.toBeSelected()
  })

  it("changes the theme and saves the preference", async () => {
    await renderSetting("light")

    await fireEvent.press(
      screen.getByRole("radio", {
        name: translate("account.appearance.exploratory"),
      }),
    )

    expect(
      screen.getByRole("radio", {
        name: translate("account.appearance.exploratory"),
      }),
    ).toBeSelected()
    expect(await AsyncStorage.getItem("theme-preference")).toBe("exploratory")
  })
})
