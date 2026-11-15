import { fireEvent, screen } from "@testing-library/react-native"
import { Text } from "react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { Button } from "./button"

describe("Button", () => {
  it("shows the title as an accessible button", async () => {
    await renderWithProviders(<Button title="Save" onPress={jest.fn()} />)

    expect(screen.getByRole("button", { name: "Save" })).toBeOnTheScreen()
    expect(screen.getByText("Save")).toBeOnTheScreen()
  })

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(<Button title="Save" onPress={onPress} />)

    await fireEvent.press(screen.getByRole("button", { name: "Save" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("ignores presses while disabled", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <Button title="Save" disabled onPress={onPress} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Save" }))

    expect(onPress).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()
  })

  it("replaces the title with a spinner and blocks presses while loading", async () => {
    const onPress = jest.fn()
    await renderWithProviders(<Button title="Save" loading onPress={onPress} />)

    const button = screen.getByRole("button", { name: "Save" })
    await fireEvent.press(button)

    expect(screen.queryByText("Save")).not.toBeOnTheScreen()
    expect(button).toBeBusy()
    expect(onPress).not.toHaveBeenCalled()
  })

  it("shows an icon next to the title", async () => {
    await renderWithProviders(
      <Button title="Save" icon={<Icon />} onPress={jest.fn()} />,
    )

    expect(screen.getByTestId("icon")).toBeOnTheScreen()
  })
})

function Icon() {
  return <Text testID="icon">i</Text>
}
