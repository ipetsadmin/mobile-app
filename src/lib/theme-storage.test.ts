import AsyncStorage from "@react-native-async-storage/async-storage"

import {
  readStoredThemePreference,
  readThemePreference,
  saveThemePreference,
} from "./theme-storage"

beforeEach(() => AsyncStorage.clear())

describe("readStoredThemePreference", () => {
  it("returns undefined when nothing was saved", async () => {
    expect(await readStoredThemePreference()).toBeUndefined()
  })

  it.each(["light", "dark", "exploratory"] as const)(
    "reads the saved %s theme",
    async (theme) => {
      await saveThemePreference(theme)

      expect(await readStoredThemePreference()).toBe(theme)
    },
  )

  it("ignores an unknown stored value", async () => {
    await AsyncStorage.setItem("theme-preference", "neon")

    expect(await readStoredThemePreference()).toBeUndefined()
  })

  it("does not treat system as a stored theme", async () => {
    await saveThemePreference("system")

    expect(await readStoredThemePreference()).toBeUndefined()
  })
})

describe("readThemePreference", () => {
  it("falls back to system", async () => {
    expect(await readThemePreference()).toBe("system")
  })

  it("returns the saved theme", async () => {
    await saveThemePreference("dark")

    expect(await readThemePreference()).toBe("dark")
  })
})
