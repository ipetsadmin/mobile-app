import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { CalendarMonths } from "./calendar-months"

const june = new Date(2026, 5, 1)

describe("CalendarMonths", () => {
  it("shows the twelve months", async () => {
    await renderWithProviders(
      <CalendarMonths month={june} locale="en" onSelect={jest.fn()} />,
    )

    expect(screen.getAllByRole("button")).toHaveLength(12)
    expect(screen.getByRole("button", { name: "Jan" })).toBeOnTheScreen()
  })

  it("marks the current month as selected", async () => {
    await renderWithProviders(
      <CalendarMonths month={june} locale="en" onSelect={jest.fn()} />,
    )

    expect(screen.getByRole("button", { name: "Jun" })).toBeSelected()
    expect(screen.getByRole("button", { name: "Jul" })).not.toBeSelected()
  })

  it("reports the first day of the pressed month in the same year", async () => {
    const onSelect = jest.fn()
    await renderWithProviders(
      <CalendarMonths month={june} locale="en" onSelect={onSelect} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Sep" }))

    expect(onSelect).toHaveBeenCalledWith(new Date(2026, 8, 1))
  })

  it("disables the months outside the allowed range", async () => {
    await renderWithProviders(
      <CalendarMonths
        month={june}
        locale="en"
        minimumDate={new Date(2026, 3, 10)}
        maximumDate={new Date(2026, 7, 10)}
        onSelect={jest.fn()}
      />,
    )

    expect(screen.getByRole("button", { name: "Mar" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Apr" })).not.toBeDisabled()
    expect(screen.getByRole("button", { name: "Aug" })).not.toBeDisabled()
    expect(screen.getByRole("button", { name: "Sep" })).toBeDisabled()
  })
})
