import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { HomeHeader } from "./home-header"

describe("HomeHeader", () => {
  it("shows the brand name", async () => {
    await renderWithProviders(<HomeHeader onOpenNotifications={jest.fn()} />)

    expect(screen.getByText(translate("common.brandName"))).toBeOnTheScreen()
  })

  it("opens the notifications when the bell is pressed", async () => {
    const onOpenNotifications = jest.fn()
    await renderWithProviders(
      <HomeHeader onOpenNotifications={onOpenNotifications} />,
    )

    await fireEvent.press(
      screen.getByRole("button", { name: translate("home.notifications") }),
    )

    expect(onOpenNotifications).toHaveBeenCalledTimes(1)
  })
})
