import AsyncStorage from "@react-native-async-storage/async-storage"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"

import { i18n } from "@/lib/i18n"
import { renderWithProviders } from "@/test/render-with-providers"

import { LanguageScreen } from "./language-screen"

beforeEach(() => AsyncStorage.clear())

describe("LanguageScreen", () => {
  it("offers english and spanish", async () => {
    await renderWithProviders(<LanguageScreen />)

    expect(screen.getByRole("radio", { name: "English" })).toBeOnTheScreen()
    expect(screen.getByRole("radio", { name: "Español" })).toBeOnTheScreen()
  })

  it("marks the current language", async () => {
    await renderWithProviders(<LanguageScreen />)

    expect(screen.getByRole("radio", { name: "Español" })).toBeSelected()
    expect(screen.getByRole("radio", { name: "English" })).not.toBeSelected()
  })

  it("switches the app language and saves it", async () => {
    await renderWithProviders(<LanguageScreen />)

    await fireEvent.press(screen.getByRole("radio", { name: "English" }))

    await waitFor(() => expect(i18n.language).toBe("en"))
    expect(await AsyncStorage.getItem("language-preference")).toBe("en")
  })
})
