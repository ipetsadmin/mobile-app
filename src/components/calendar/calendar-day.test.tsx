import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { CalendarDay } from "./calendar-day"

const props = {
  day: 15,
  accessibilityLabel: "June 15, 2026",
  selected: false,
  disabled: false,
}

describe("CalendarDay", () => {
  it("shows the day number under its full date label", async () => {
    await renderWithProviders(<CalendarDay {...props} onPress={jest.fn()} />)

    expect(
      screen.getByRole("button", { name: "June 15, 2026" }),
    ).toBeOnTheScreen()
    expect(screen.getByText("15")).toBeOnTheScreen()
  })

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn()
    await renderWithProviders(<CalendarDay {...props} onPress={onPress} />)

    await fireEvent.press(screen.getByRole("button", { name: "June 15, 2026" }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("reflects the selected state", async () => {
    await renderWithProviders(
      <CalendarDay {...props} selected onPress={jest.fn()} />,
    )

    expect(screen.getByRole("button", { name: "June 15, 2026" })).toBeSelected()
  })

  it("ignores presses while disabled", async () => {
    const onPress = jest.fn()
    await renderWithProviders(
      <CalendarDay {...props} disabled onPress={onPress} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "June 15, 2026" }))

    expect(onPress).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: "June 15, 2026" })).toBeDisabled()
  })
})
