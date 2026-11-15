import { renderHook } from "@testing-library/react-native"

import { Fonts, Themes } from "@/constants/theme"

import { useHeaderOptions } from "./use-header-options"

describe("useHeaderOptions", () => {
  it("styles the standard header with the theme colors and font", async () => {
    const { result } = await renderHook(() => useHeaderOptions())

    expect(result.current.standard).toMatchObject({
      headerShadowVisible: false,
      headerTintColor: Themes.light.text,
      headerStyle: { backgroundColor: Themes.light.background },
      headerTitleStyle: { fontFamily: Fonts.bold, color: Themes.light.text },
    })
  })

  it("makes the large title header transparent", async () => {
    const { result } = await renderHook(() => useHeaderOptions())

    expect(result.current.largeTitle).toMatchObject({
      headerLargeTitleEnabled: true,
      headerTransparent: true,
      headerTintColor: Themes.light.text,
    })
  })

  it("shows only the back arrow in both variants", async () => {
    const { result } = await renderHook(() => useHeaderOptions())

    expect(result.current.standard.headerBackButtonDisplayMode).toBe("minimal")
    expect(result.current.largeTitle.headerBackButtonDisplayMode).toBe(
      "minimal",
    )
  })
})
