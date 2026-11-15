import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { NewCompanionCard } from "./new-companion-card"

describe("NewCompanionCard", () => {
  it("shows the title and the subtitle", async () => {
    await renderWithProviders(<NewCompanionCard onPress={jest.fn()} />)

    expect(
      screen.getByText(translate("companions.newCompanion.subtitle")),
    ).toBeOnTheScreen()
  })

  it("is a button that calls onPress", async () => {
    const onPress = jest.fn()
    await renderWithProviders(<NewCompanionCard onPress={onPress} />)

    await fireEvent.press(
      screen.getByRole("button", {
        name: translate("companions.newCompanion.title"),
      }),
    )

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
