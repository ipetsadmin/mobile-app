import { act, renderHook } from "@testing-library/react-native"

import { YEARS_PER_PAGE } from "@/utils/calendar"
import { formatMonthYear } from "@/utils/format-date"

import { useCalendarView } from "./use-calendar-view"

const month = (year: number, monthNumber: number) =>
  new Date(year, monthNumber - 1, 1)

type Args = Parameters<typeof useCalendarView>[0]

const render = (args: Partial<Args> = {}) =>
  renderHook(() =>
    useCalendarView({ value: new Date(2026, 5, 15), locale: "en", ...args }),
  )

describe("initial state", () => {
  it("shows the days of the month of the selected value", async () => {
    const { result } = await render()

    expect(result.current.view).toBe("days")
    expect(result.current.month).toEqual(month(2026, 6))
    expect(result.current.title).toBe(formatMonthYear(month(2026, 6), "en"))
  })

  it("falls back to the maximum date and then to today", async () => {
    const withMaximum = await render({
      value: undefined,
      maximumDate: new Date(2024, 2, 20),
    })
    const withNothing = await render({ value: undefined })

    expect(withMaximum.result.current.month).toEqual(month(2024, 3))
    expect(withNothing.result.current.month.getDate()).toBe(1)
  })
})

describe("moving between periods", () => {
  it("goes to the next and previous month in the days view", async () => {
    const { result } = await render()

    await act(async () => {
      result.current.goNext()
    })
    expect(result.current.month).toEqual(month(2026, 7))

    await act(async () => {
      result.current.goPrevious()
    })
    await act(async () => {
      result.current.goPrevious()
    })
    expect(result.current.month).toEqual(month(2026, 5))
  })

  it("moves a year at a time in the months view", async () => {
    const { result } = await render()

    await act(async () => {
      result.current.zoomOut?.()
    })
    await act(async () => {
      result.current.goNext()
    })

    expect(result.current.view).toBe("months")
    expect(result.current.month).toEqual(month(2027, 6))
    expect(result.current.title).toBe("2027")
  })

  it("moves a page of years at a time in the years view", async () => {
    const { result } = await render()

    await act(async () => {
      result.current.zoomOut?.()
    })
    await act(async () => {
      result.current.zoomOut?.()
    })
    await act(async () => {
      result.current.goPrevious()
    })

    expect(result.current.view).toBe("years")
    expect(result.current.month.getFullYear()).toBe(2026 - YEARS_PER_PAGE)
  })

  it("does not move past the limits", async () => {
    const { result } = await render({
      minimumDate: new Date(2026, 5, 1),
      maximumDate: new Date(2026, 5, 30),
    })

    expect(result.current.canGoPrevious).toBe(false)
    expect(result.current.canGoNext).toBe(false)

    await act(async () => {
      result.current.goNext()
    })
    await act(async () => {
      result.current.goPrevious()
    })

    expect(result.current.month).toEqual(month(2026, 6))
  })

  it("allows moving while there is room before the maximum", async () => {
    const { result } = await render({ maximumDate: new Date(2026, 8, 1) })

    expect(result.current.canGoNext).toBe(true)
    expect(result.current.canGoPrevious).toBe(true)
  })
})

describe("zooming", () => {
  it("zooms out from days to months to years and no further", async () => {
    const { result } = await render()

    await act(async () => {
      result.current.zoomOut?.()
    })
    expect(result.current.view).toBe("months")

    await act(async () => {
      result.current.zoomOut?.()
    })
    expect(result.current.view).toBe("years")
    expect(result.current.zoomOut).toBeUndefined()
  })

  it("selecting a year goes down to its months", async () => {
    const { result } = await render()

    await act(async () => {
      result.current.zoomOut?.()
    })
    await act(async () => {
      result.current.zoomOut?.()
    })
    await act(async () => {
      result.current.selectYear(month(2020, 6))
    })

    expect(result.current.view).toBe("months")
    expect(result.current.month).toEqual(month(2020, 6))
  })

  it("selecting a month goes down to its days", async () => {
    const { result } = await render()

    await act(async () => {
      result.current.zoomOut?.()
    })
    await act(async () => {
      result.current.selectMonth(month(2026, 9))
    })

    expect(result.current.view).toBe("days")
    expect(result.current.month).toEqual(month(2026, 9))
  })

  it("keeps a selected month inside the limits", async () => {
    const { result } = await render({ maximumDate: new Date(2026, 6, 1) })

    await act(async () => {
      result.current.selectMonth(month(2030, 1))
    })

    expect(result.current.month).toEqual(month(2026, 7))
  })
})
