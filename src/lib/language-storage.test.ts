import AsyncStorage from "@react-native-async-storage/async-storage"

import {
  readLanguagePreference,
  saveLanguagePreference,
} from "./language-storage"

beforeEach(() => AsyncStorage.clear())

describe("language preference", () => {
  it("returns undefined when nothing was saved", async () => {
    expect(await readLanguagePreference()).toBeUndefined()
  })

  it.each(["en", "es"] as const)("saves and reads %s", async (language) => {
    await saveLanguagePreference(language)

    expect(await readLanguagePreference()).toBe(language)
  })

  it("ignores a stored value that is not a supported language", async () => {
    await AsyncStorage.setItem("language-preference", "fr")

    expect(await readLanguagePreference()).toBeUndefined()
  })
})
