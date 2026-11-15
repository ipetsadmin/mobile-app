import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { CalendarYears } from "./calendar-years"

const june = new Date(2026, 5, 1)

describe("CalendarYears", () => {
  it("shows a page of twelve years from the first year", async () => {
    await renderWithProviders(
      <CalendarYears month={june} firstYear={2016} onSelect={jest.fn()} />,
    )

    expect(screen.getAllByRole("button")).toHaveLength(12)
    expect(screen.getByRole("button", { name: "2016" })).toBeOnTheScreen()
    expect(screen.getByRole("button", { name: "2027" })).toBeOnTheScreen()
  })

  it("marks the current year as selected", async () => {
    await renderWithProviders(
      <CalendarYears month={june} firstYear={2016} onSelect={jest.fn()} />,
    )

    expect(screen.getByRole("button", { name: "2026" })).toBeSelected()
  })

  it("reports the pressed year keeping the current month", async () => {
    const onSelect = jest.fn()
    await renderWithProviders(
      <CalendarYears month={june} firstYear={2016} onSelect={onSelect} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "2020" }))

    expect(onSelect).toHaveBeenCalledWith(new Date(2020, 5, 1))
  })

  it("disables the years outside the allowed range", async () => {
    await renderWithProviders(
      <CalendarYears
        month={june}
        firstYear={2016}
        minimumDate={new Date(2018, 0, 1)}
        maximumDate={new Date(2026, 11, 31)}
        onSelect={jest.fn()}
      />,
    )

    expect(screen.getByRole("button", { name: "2017" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "2018" })).not.toBeDisabled()
    expect(screen.getByRole("button", { name: "2027" })).toBeDisabled()
  })
})
