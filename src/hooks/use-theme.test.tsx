import AsyncStorage from "@react-native-async-storage/async-storage"
import { act, renderHook } from "@testing-library/react-native"
import type { ReactNode } from "react"

import { Themes } from "@/constants/theme"
import { AppThemeProvider } from "@/providers/theme-provider"

import { useTheme, useThemePreference } from "./use-theme"

type Preference = "system" | "light" | "dark" | "exploratory"

const wrappers: Record<
  Preference,
  (props: { children: ReactNode }) => ReactNode
> = {
  system: ({ children }) => (
    <AppThemeProvider initialPreference="system">{children}</AppThemeProvider>
  ),
  light: ({ children }) => (
    <AppThemeProvider initialPreference="light">{children}</AppThemeProvider>
  ),
  dark: ({ children }) => (
    <AppThemeProvider initialPreference="dark">{children}</AppThemeProvider>
  ),
  exploratory: ({ children }) => (
    <AppThemeProvider initialPreference="exploratory">
      {children}
    </AppThemeProvider>
  ),
}

const wrapperFor = (preference: Preference) => wrappers[preference]

beforeEach(() => AsyncStorage.clear())

describe("without a provider", () => {
  it("uses the light theme by default", async () => {
    const { result } = await renderHook(() => useTheme())

    expect(result.current).toBe(Themes.light)
  })
})

describe("with the theme provider", () => {
  it.each(["light", "dark", "exploratory"] as const)(
    "applies the %s preference",
    async (name) => {
      const { result } = await renderHook(() => useTheme(), {
        wrapper: wrapperFor(name),
      })

      expect(result.current).toBe(Themes[name])
    },
  )

  it("exposes the preference and the active theme name", async () => {
    const { result } = await renderHook(() => useThemePreference(), {
      wrapper: wrapperFor("dark"),
    })

    expect(result.current.preference).toBe("dark")
    expect(result.current.themeName).toBe("dark")
  })

  it("follows the device when the preference is system", async () => {
    const { result } = await renderHook(() => useThemePreference(), {
      wrapper: wrapperFor("system"),
    })

    expect(result.current.preference).toBe("system")
    expect(["light", "dark"]).toContain(result.current.themeName)
  })

  it("changes the theme and saves the preference", async () => {
    const { result } = await renderHook(
      () => ({ theme: useTheme(), preference: useThemePreference() }),
      { wrapper: wrapperFor("light") },
    )

    await act(async () => {
      result.current.preference.setPreference("dark")
    })

    expect(result.current.theme).toBe(Themes.dark)
    expect(await AsyncStorage.getItem("theme-preference")).toBe("dark")
  })
})
