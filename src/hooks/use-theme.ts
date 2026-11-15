import { use } from "react"
import { Themes } from "@/constants/theme"
import { ThemeContext } from "@/providers/theme-provider"

export function useTheme() {
  return Themes[use(ThemeContext).themeName]
}

export function useThemePreference() {
  return use(ThemeContext)
}
