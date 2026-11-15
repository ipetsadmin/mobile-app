import AsyncStorage from "@react-native-async-storage/async-storage"
import { act } from "@testing-library/react-native"

import { i18n } from "@/lib/i18n"
import { renderHookWithProviders } from "@/test/render-with-providers"

import { useLanguageSetting } from "./use-language-setting"

beforeEach(() => AsyncStorage.clear())

describe("useLanguageSetting", () => {
  it("reports the current language", async () => {
    const { result } = await renderHookWithProviders(() => useLanguageSetting())

    expect(result.current.language).toBe("es")
  })

  it("treats regional variants as their base language", async () => {
    const { result } = await renderHookWithProviders(() => useLanguageSetting())

    await act(async () => {
      await i18n.changeLanguage("en-US")
    })

    expect(result.current.language).toBe("en")
  })

  it("falls back to english for unsupported languages", async () => {
    const { result } = await renderHookWithProviders(() => useLanguageSetting())

    await act(async () => {
      await i18n.changeLanguage("fr")
    })

    expect(result.current.language).toBe("en")
  })

  it("changes the app language and saves the preference", async () => {
    const { result } = await renderHookWithProviders(() => useLanguageSetting())

    await act(async () => {
      result.current.setLanguage("en")
    })

    expect(i18n.language).toBe("en")
    expect(await AsyncStorage.getItem("language-preference")).toBe("en")
  })
})
