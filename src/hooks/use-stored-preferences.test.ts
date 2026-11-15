import AsyncStorage from "@react-native-async-storage/async-storage"
import { renderHook, waitFor } from "@testing-library/react-native"

import { i18n } from "@/lib/i18n"

import { useStoredPreferences } from "./use-stored-preferences"

beforeEach(async () => {
  await AsyncStorage.clear()
  await i18n.changeLanguage("es")
})

describe("useStoredPreferences", () => {
  it("falls back to the system theme when nothing was saved", async () => {
    const { result } = await renderHook(() => useStoredPreferences())

    await waitFor(() => expect(result.current.isLoaded).toBe(true))
    expect(result.current.themePreference).toBe("system")
  })

  it("loads the saved theme and applies the saved language", async () => {
    await AsyncStorage.setItem("theme-preference", "dark")
    await AsyncStorage.setItem("language-preference", "en")

    const { result } = await renderHook(() => useStoredPreferences())

    await waitFor(() => expect(result.current.themePreference).toBe("dark"))
    expect(i18n.language).toBe("en")
  })

  it("keeps the current language when none was saved", async () => {
    const { result } = await renderHook(() => useStoredPreferences())

    await waitFor(() => expect(result.current.isLoaded).toBe(true))
    expect(i18n.language).toBe("es")
  })

  it("uses the system theme when reading the storage fails", async () => {
    jest.spyOn(AsyncStorage, "getItem").mockRejectedValue(new Error("disk"))

    const { result } = await renderHook(() => useStoredPreferences())

    await waitFor(() => expect(result.current.themePreference).toBe("system"))
  })
})
