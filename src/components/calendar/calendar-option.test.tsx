import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { CalendarOption } from "./calendar-option"

const props = { label: "Jun", selected: false, disabled: false }

describe("CalendarOption", () => {
  it("shows its label as a button", async () => {
    await renderWithProviders(<CalendarOption {...props} onPress={jest.fn()} />)

    expect(screen.getByRole("button", { name: "Jun" })).toBeOnTheScreen()
  })

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(<CalendarOption {...props} onPress={onPress} />)

    await fireEvent.press(screen.getByRole("button", { name: "Jun" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("reflects the selected state", async () => {
    await renderWithProviders(
      <CalendarOption {...props} selected onPress={jest.fn()} />,
    )

    expect(screen.getByRole("button", { name: "Jun" })).toBeSelected()
  })

  it("ignores presses while disabled", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <CalendarOption {...props} disabled onPress={onPress} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Jun" }))

    expect(onPress).not.toHaveBeenCalled()
  })
})
