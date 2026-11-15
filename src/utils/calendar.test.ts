import {
  addMonths,
  clampMonth,
  endOfDay,
  getDaysBetween,
  getFirstWeekday,
  getMonthCells,
  getMonthLabels,
  getSignedDaysBetween,
  getWeekdayLabels,
  getYearPageStart,
  isDayWithinRange,
  isMonthWithinRange,
  isSameDay,
  startOfDay,
  startOfMonth,
  subtractYears,
  toNoon,
  YEARS_PER_PAGE,
} from "./calendar"

const day = (year: number, month: number, date: number) =>
  new Date(year, month - 1, date)

describe("start and end of periods", () => {
  it("startOfDay drops the time", () => {
    expect(startOfDay(new Date(2026, 5, 15, 18, 45))).toEqual(day(2026, 6, 15))
  })

  it("endOfDay is the last millisecond of the day", () => {
    expect(endOfDay(day(2026, 6, 15))).toEqual(
      new Date(2026, 5, 15, 23, 59, 59, 999),
    )
  })

  it("toNoon moves the time to twelve", () => {
    expect(toNoon(new Date(2026, 5, 15, 3, 10))).toEqual(
      new Date(2026, 5, 15, 12),
    )
  })

  it("startOfMonth returns the first day", () => {
    expect(startOfMonth(day(2026, 6, 20))).toEqual(day(2026, 6, 1))
  })
})

describe("addMonths and subtractYears", () => {
  it("addMonths crosses the year boundary", () => {
    expect(addMonths(day(2026, 11, 20), 3)).toEqual(day(2027, 2, 1))
  })

  it("addMonths accepts negative amounts", () => {
    expect(addMonths(day(2026, 1, 20), -1)).toEqual(day(2025, 12, 1))
  })

  it("subtractYears keeps month and day", () => {
    expect(subtractYears(day(2026, 6, 15), 3)).toEqual(day(2023, 6, 15))
  })
})

describe("day differences", () => {
  it("getSignedDaysBetween ignores the time of day", () => {
    const morning = new Date(2026, 5, 15, 8)
    const nextNight = new Date(2026, 5, 16, 23)

    expect(getSignedDaysBetween(morning, nextNight)).toBe(1)
  })

  it("getSignedDaysBetween is negative when the end is earlier", () => {
    expect(getSignedDaysBetween(day(2026, 6, 15), day(2026, 6, 12))).toBe(-3)
  })

  it("getDaysBetween never returns a negative number", () => {
    expect(getDaysBetween(day(2026, 6, 15), day(2026, 6, 12))).toBe(0)
    expect(getDaysBetween(day(2026, 6, 12), day(2026, 6, 15))).toBe(3)
  })
})

describe("isSameDay", () => {
  it("is true for different times of the same day", () => {
    expect(isSameDay(new Date(2026, 5, 15, 1), new Date(2026, 5, 15, 23))).toBe(
      true,
    )
  })

  it("is false for the same day number in another month", () => {
    expect(isSameDay(day(2026, 6, 15), day(2026, 7, 15))).toBe(false)
  })
})

describe("getFirstWeekday", () => {
  it("starts on sunday for english and monday otherwise", () => {
    expect(getFirstWeekday("en-US")).toBe(0)
    expect(getFirstWeekday("es")).toBe(1)
  })
})

describe("getMonthCells", () => {
  it("pads the start with blanks so day one lands on its weekday", () => {
    const cells = getMonthCells(day(2026, 6, 1), 0)

    expect(cells.slice(0, 1)).toEqual([null])
    expect(cells[1]).toEqual(day(2026, 6, 1))
  })

  it("respects a monday-first week", () => {
    const cells = getMonthCells(day(2026, 6, 1), 1)

    expect(cells[0]).toEqual(day(2026, 6, 1))
  })

  it("contains one cell per day of the month", () => {
    const days = getMonthCells(day(2026, 2, 1), 0).filter(Boolean)

    expect(days).toHaveLength(28)
  })
})

describe("labels", () => {
  it("getWeekdayLabels returns seven labels starting on the first weekday", () => {
    const labels = getWeekdayLabels("en", 0)

    expect(labels).toHaveLength(7)
    expect(labels[0]).toBe("Sun")
    expect(getWeekdayLabels("en", 1)[0]).toBe("Mon")
  })

  it("getMonthLabels returns twelve month names", () => {
    const labels = getMonthLabels("en")

    expect(labels).toHaveLength(12)
    expect(labels[0]).toBe("Jan")
    expect(labels[11]).toBe("Dec")
  })
})

describe("ranges", () => {
  const minimum = day(2026, 6, 10)
  const maximum = day(2026, 6, 20)

  it("isDayWithinRange includes both limits", () => {
    expect(isDayWithinRange(day(2026, 6, 10), minimum, maximum)).toBe(true)
    expect(isDayWithinRange(day(2026, 6, 20), minimum, maximum)).toBe(true)
  })

  it("isDayWithinRange rejects days outside the limits", () => {
    expect(isDayWithinRange(day(2026, 6, 9), minimum, maximum)).toBe(false)
    expect(isDayWithinRange(day(2026, 6, 21), minimum, maximum)).toBe(false)
  })

  it("isDayWithinRange accepts any day without limits", () => {
    expect(isDayWithinRange(day(1990, 1, 1))).toBe(true)
  })

  it("isMonthWithinRange compares whole months", () => {
    expect(isMonthWithinRange(day(2026, 6, 1), minimum, maximum)).toBe(true)
    expect(isMonthWithinRange(day(2026, 5, 1), minimum, maximum)).toBe(false)
    expect(isMonthWithinRange(day(2026, 7, 1), minimum, maximum)).toBe(false)
  })

  it("clampMonth moves a month inside the limits", () => {
    expect(clampMonth(day(2026, 1, 1), minimum, maximum)).toEqual(
      day(2026, 6, 1),
    )
    expect(clampMonth(day(2027, 1, 1), minimum, maximum)).toEqual(
      day(2026, 6, 1),
    )
    expect(clampMonth(day(2026, 6, 1), minimum, maximum)).toEqual(
      day(2026, 6, 1),
    )
  })
})

describe("getYearPageStart", () => {
  it("aligns pages to multiples of the page size without a limit", () => {
    expect(getYearPageStart(2026)).toBe(2016)
  })

  it("ends the first page on the last selectable year", () => {
    expect(getYearPageStart(2026, 2026)).toBe(2026 - YEARS_PER_PAGE + 1)
  })

  it("moves back one page at a time from the last selectable year", () => {
    expect(getYearPageStart(2010, 2026)).toBe(2026 - YEARS_PER_PAGE * 2 + 1)
  })
})
