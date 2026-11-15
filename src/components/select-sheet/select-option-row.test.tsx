import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { SelectOptionRow } from "./select-option-row"

describe("SelectOptionRow", () => {
  it("is a radio with its label", async () => {
    await renderWithProviders(
      <SelectOptionRow label="Labrador" selected={false} onPress={jest.fn()} />,
    )

    expect(screen.getByRole("radio", { name: "Labrador" })).toBeOnTheScreen()
  })

  it("reflects whether it is selected", async () => {
    await renderWithProviders(
      <>
        <SelectOptionRow label="Labrador" selected onPress={jest.fn()} />
        <SelectOptionRow label="Poodle" selected={false} onPress={jest.fn()} />
      </>,
    )

    expect(screen.getByRole("radio", { name: "Labrador" })).toBeSelected()
    expect(screen.getByRole("radio", { name: "Poodle" })).not.toBeSelected()
  })

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <SelectOptionRow label="Labrador" selected={false} onPress={onPress} />,
    )

    await fireEvent.press(screen.getByRole("radio", { name: "Labrador" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
