import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { Calendar } from "./index"

const props = {
  locale: "en",
  previousLabel: "Previous",
  nextLabel: "Next",
  onChange: jest.fn(),
}

describe("Calendar", () => {
  it("opens on the month of the selected value", async () => {
    await renderWithProviders(
      <Calendar {...props} value={new Date(2026, 5, 15)} />,
    )

    expect(screen.getByText("June 2026")).toBeOnTheScreen()
    expect(screen.getByRole("button", { name: "June 15, 2026" })).toBeSelected()
  })

  it("reports the pressed day", async () => {
    const onChange = jest.fn()
    await renderWithProviders(
      <Calendar {...props} value={new Date(2026, 5, 15)} onChange={onChange} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "June 20, 2026" }))

    expect(onChange).toHaveBeenCalledWith(new Date(2026, 5, 20))
  })

  it("moves between months with the arrows", async () => {
    await renderWithProviders(
      <Calendar {...props} value={new Date(2026, 5, 15)} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByText("July 2026")).toBeOnTheScreen()

    await fireEvent.press(screen.getByRole("button", { name: "Previous" }))
    await fireEvent.press(screen.getByRole("button", { name: "Previous" }))
    expect(screen.getByText("May 2026")).toBeOnTheScreen()
  })

  it("zooms out to the months and back to the days of the chosen month", async () => {
    await renderWithProviders(
      <Calendar {...props} value={new Date(2026, 5, 15)} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "June 2026" }))
    expect(screen.getByText("2026")).toBeOnTheScreen()

    await fireEvent.press(screen.getByRole("button", { name: "Sep" }))
    expect(screen.getByText("September 2026")).toBeOnTheScreen()
  })

  it("zooms out again to the years and down to a chosen year", async () => {
    await renderWithProviders(
      <Calendar {...props} value={new Date(2026, 5, 15)} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "June 2026" }))
    await fireEvent.press(screen.getByRole("button", { name: "2026" }))
    await fireEvent.press(screen.getByRole("button", { name: "2020" }))

    expect(screen.getByText("2020")).toBeOnTheScreen()
    expect(screen.getByRole("button", { name: "Jun" })).toBeSelected()
  })

  it("does not move past the maximum date", async () => {
    await renderWithProviders(
      <Calendar
        {...props}
        value={new Date(2026, 5, 15)}
        maximumDate={new Date(2026, 5, 30)}
      />,
    )

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it("is marked disabled when disabled", async () => {
    const { toJSON } = await renderWithProviders(
      <Calendar {...props} value={new Date(2026, 5, 15)} disabled />,
    )

    expect(JSON.stringify(toJSON())).toContain('"pointerEvents":"none"')
  })
})
