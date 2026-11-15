import { fireEvent, screen } from "@testing-library/react-native"
import { Text } from "react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { OptionCard } from "./option-card"

describe("OptionCard", () => {
  it("is a radio with its label", async () => {
    await renderWithProviders(
      <OptionCard label="Dog" selected={false} onPress={jest.fn()} />,
    )

    expect(screen.getByRole("radio", { name: "Dog" })).toBeOnTheScreen()
  })

  it("reflects whether it is selected", async () => {
    await renderWithProviders(
      <>
        <OptionCard label="Dog" selected onPress={jest.fn()} />
        <OptionCard label="Cat" selected={false} onPress={jest.fn()} />
      </>,
    )

    expect(screen.getByRole("radio", { name: "Dog" })).toBeSelected()
    expect(screen.getByRole("radio", { name: "Cat" })).not.toBeSelected()
  })

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <OptionCard label="Dog" selected={false} onPress={onPress} />,
    )

    await fireEvent.press(screen.getByRole("radio", { name: "Dog" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("ignores presses while disabled", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <OptionCard label="Dog" selected={false} disabled onPress={onPress} />,
    )

    await fireEvent.press(screen.getByRole("radio", { name: "Dog" }))

    expect(onPress).not.toHaveBeenCalled()
    expect(screen.getByRole("radio", { name: "Dog" })).toBeDisabled()
  })

  it("shows an icon", async () => {
    await renderWithProviders(
      <OptionCard
        label="Dog"
        selected={false}
        icon={<Text testID="icon">i</Text>}
        onPress={jest.fn()}
      />,
    )

    expect(screen.getByTestId("icon")).toBeOnTheScreen()
  })
})
