import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { CalendarDays } from "./calendar-days"

const june = new Date(2026, 5, 1)

describe("CalendarDays", () => {
  it("shows the weekday headers and every day of the month", async () => {
    await renderWithProviders(
      <CalendarDays month={june} locale="en" onSelect={jest.fn()} />,
    )

    expect(screen.getByText("Sun")).toBeOnTheScreen()
    expect(screen.getAllByRole("button")).toHaveLength(30)
  })

  it("labels each day with its long date", async () => {
    await renderWithProviders(
      <CalendarDays month={june} locale="en" onSelect={jest.fn()} />,
    )

    expect(
      screen.getByRole("button", { name: "June 15, 2026" }),
    ).toBeOnTheScreen()
  })

  it("reports the pressed day", async () => {
    const onSelect = jest.fn()
    await renderWithProviders(
      <CalendarDays month={june} locale="en" onSelect={onSelect} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "June 15, 2026" }))

    expect(onSelect).toHaveBeenCalledWith(new Date(2026, 5, 15))
  })

  it("marks the selected day", async () => {
    await renderWithProviders(
      <CalendarDays
        month={june}
        value={new Date(2026, 5, 15, 18)}
        locale="en"
        onSelect={jest.fn()}
      />,
    )

    expect(screen.getByRole("button", { name: "June 15, 2026" })).toBeSelected()
    expect(
      screen.getByRole("button", { name: "June 16, 2026" }),
    ).not.toBeSelected()
  })

  it("disables the days outside the allowed range", async () => {
    await renderWithProviders(
      <CalendarDays
        month={june}
        locale="en"
        minimumDate={new Date(2026, 5, 10)}
        maximumDate={new Date(2026, 5, 20)}
        onSelect={jest.fn()}
      />,
    )

    expect(screen.getByRole("button", { name: "June 9, 2026" })).toBeDisabled()
    expect(
      screen.getByRole("button", { name: "June 10, 2026" }),
    ).not.toBeDisabled()
    expect(
      screen.getByRole("button", { name: "June 20, 2026" }),
    ).not.toBeDisabled()
    expect(screen.getByRole("button", { name: "June 21, 2026" })).toBeDisabled()
  })

  it("starts the week on monday for non english locales", async () => {
    await renderWithProviders(
      <CalendarDays month={june} locale="es" onSelect={jest.fn()} />,
    )

    expect(screen.getByText("lun")).toBeOnTheScreen()
  })
})
