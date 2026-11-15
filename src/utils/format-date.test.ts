import { i18n } from "@/lib/i18n"

import {
  formatDateTime,
  formatDayHeading,
  formatDayLabel,
  formatLongDate,
  formatMediumDate,
  formatMonthYear,
  formatRelativeDays,
  formatTime,
} from "./format-date"

const date = new Date(2026, 5, 15, 14, 30)
const today = new Date(2026, 5, 15, 9)
const daysFromToday = (offset: number) => new Date(2026, 5, 15 + offset, 9)

describe("date formatters", () => {
  it("formatLongDate", () => {
    expect(formatLongDate(date, "en")).toBe("June 15, 2026")
  })

  it("formatMonthYear", () => {
    expect(formatMonthYear(date, "en")).toBe("June 2026")
  })

  it("formatMediumDate", () => {
    expect(formatMediumDate(date, "en")).toBe("Jun 15, 2026")
  })

  it("formatDayLabel joins weekday and day", () => {
    expect(formatDayLabel(date, "en")).toBe("Monday · Jun 15")
  })

  it("formatTime", () => {
    expect(formatTime(date, "en")).toMatch(/2:30\s?PM/)
  })

  it("formatDateTime", () => {
    expect(formatDateTime(date, "en")).toMatch(/Jun 15, 2026.*2:30\s?PM/)
  })
})

describe("relative days", () => {
  const t = i18n.getFixedT("es")

  it.each([
    [0, "Hoy"],
    [1, "Mañana"],
    [-1, "Ayer"],
    [3, "En 3 días"],
    [-4, "Hace 4 días"],
  ])("formatRelativeDays for offset %i", (offset, expected) => {
    expect(formatRelativeDays(daysFromToday(offset), today, t)).toBe(expected)
  })

  it("uses the singular for one day", () => {
    const english = i18n.getFixedT("en")

    expect(formatRelativeDays(daysFromToday(2), today, english)).toBe(
      "In 2 days",
    )
  })
})

describe("formatDayHeading", () => {
  const t = i18n.getFixedT("es")

  it("uses relative words for today and tomorrow", () => {
    expect(formatDayHeading(today, today, "es", t)).toBe("Hoy")
    expect(formatDayHeading(daysFromToday(1), today, "es", t)).toBe("Mañana")
  })

  it("uses the weekday label from the day after tomorrow", () => {
    expect(formatDayHeading(daysFromToday(2), today, "en", t)).toBe(
      "Wednesday · Jun 17",
    )
  })

  it("does not use relative words for the past", () => {
    expect(formatDayHeading(daysFromToday(-1), today, "en", t)).toBe(
      "Sunday · Jun 14",
    )
  })
})
