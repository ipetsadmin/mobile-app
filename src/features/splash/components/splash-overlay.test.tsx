import { screen } from "@testing-library/react-native"
import type { ReactNode } from "react"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { SplashOverlay } from "./splash-overlay"
import { SplashProvider } from "./splash-provider"

const inProvider = (children: ReactNode) => (
  <SplashProvider>{children}</SplashProvider>
)

describe("SplashOverlay", () => {
  it("shows the brand while the splash has not finished", async () => {
    await renderWithProviders(inProvider(<SplashOverlay isReady={false} />))

    expect(
      screen.getByLabelText(translate("common.brandName")),
    ).toBeOnTheScreen()
  })

  it("shows the three phrases of the intro", async () => {
    await renderWithProviders(inProvider(<SplashOverlay isReady={false} />))

    expect(screen.getByText(translate("splash.notOwn"))).toBeOnTheScreen()
    expect(screen.getByText(translate("splash.notManaged"))).toBeOnTheScreen()
    expect(screen.getByText(translate("splash.related"))).toBeOnTheScreen()
  })

  it("renders nothing outside the provider, where the splash counts as finished", async () => {
    await renderWithProviders(<SplashOverlay isReady />)

    expect(
      screen.queryByLabelText(translate("common.brandName")),
    ).not.toBeOnTheScreen()
  })
})
