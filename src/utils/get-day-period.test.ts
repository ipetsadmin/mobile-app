import { getDayPeriod } from "./get-day-period"

const at = (hour: number, minute = 0) => new Date(2026, 5, 15, hour, minute)

describe("getDayPeriod", () => {
  it.each([
    [0, "morning"],
    [11, "morning"],
    [12, "afternoon"],
    [17, "afternoon"],
    [18, "evening"],
    [23, "evening"],
  ])("returns the period for hour %i", (hour, expected) => {
    expect(getDayPeriod(at(hour))).toBe(expected)
  })

  it("uses the hour and ignores the minutes", () => {
    expect(getDayPeriod(at(11, 59))).toBe("morning")
    expect(getDayPeriod(at(17, 59))).toBe("afternoon")
  })
})
