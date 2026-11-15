import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { HeaderBackButton } from "./header-back-button"

describe("HeaderBackButton", () => {
  it("is announced with its label", async () => {
    await renderWithProviders(
      <HeaderBackButton label="Close" onPress={jest.fn()} />,
    )

    expect(screen.getByRole("button", { name: "Close" })).toBeOnTheScreen()
  })

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <HeaderBackButton label="Close" onPress={onPress} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Close" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
