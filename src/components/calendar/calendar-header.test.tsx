import { fireEvent, screen } from "@testing-library/react-native"

import { renderWithProviders } from "@/test/render-with-providers"

import { CalendarHeader } from "./calendar-header"

const props = {
  title: "June 2026",
  previousLabel: "Previous",
  nextLabel: "Next",
  canGoPrevious: true,
  canGoNext: true,
  onPrevious: jest.fn(),
  onNext: jest.fn(),
}

describe("CalendarHeader", () => {
  it("shows the title and both arrows", async () => {
    await renderWithProviders(<CalendarHeader {...props} />)

    expect(screen.getByText("June 2026")).toBeOnTheScreen()
    expect(screen.getByRole("button", { name: "Previous" })).toBeOnTheScreen()
    expect(screen.getByRole("button", { name: "Next" })).toBeOnTheScreen()
  })

  it("calls the arrow handlers", async () => {
    const onPrevious = jest.fn()
    const onNext = jest.fn()
    await renderWithProviders(
      <CalendarHeader {...props} onPrevious={onPrevious} onNext={onNext} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "Previous" }))
    await fireEvent.press(screen.getByRole("button", { name: "Next" }))

    expect(onPrevious).toHaveBeenCalledTimes(1)
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("disables an arrow that cannot move", async () => {
    await renderWithProviders(
      <CalendarHeader {...props} canGoPrevious={false} />,
    )

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled()
  })

  it("zooms out when the title is pressed", async () => {
    const onTitlePress = jest.fn()
    await renderWithProviders(
      <CalendarHeader {...props} onTitlePress={onTitlePress} />,
    )

    await fireEvent.press(screen.getByRole("button", { name: "June 2026" }))

    expect(onTitlePress).toHaveBeenCalledTimes(1)
  })

  it("has an inert title when it cannot zoom out", async () => {
    await renderWithProviders(<CalendarHeader {...props} />)

    expect(screen.getByRole("button", { name: "June 2026" })).toBeDisabled()
  })
})
