import { getAge } from "./get-age"

const day = (year: number, month: number, date: number) =>
  new Date(year, month - 1, date)

describe("getAge", () => {
  it("counts whole years once a year has passed", () => {
    expect(getAge(day(2023, 3, 10), day(2026, 3, 10))).toEqual({
      unit: "years",
      count: 3,
    })
  })

  it("does not count the year before the birthday month and day", () => {
    expect(getAge(day(2023, 3, 10), day(2026, 3, 9))).toEqual({
      unit: "years",
      count: 2,
    })
  })

  it("switches from months to years at twelve months", () => {
    expect(getAge(day(2025, 6, 15), day(2026, 5, 15))).toEqual({
      unit: "months",
      count: 11,
    })
    expect(getAge(day(2025, 6, 15), day(2026, 6, 15))).toEqual({
      unit: "years",
      count: 1,
    })
  })

  it("returns zero months for a pet born this month", () => {
    expect(getAge(day(2026, 6, 1), day(2026, 6, 20))).toEqual({
      unit: "months",
      count: 0,
    })
  })

  it("never returns a negative age for a future birth date", () => {
    expect(getAge(day(2027, 1, 1), day(2026, 6, 1))).toEqual({
      unit: "months",
      count: 0,
    })
  })
})
