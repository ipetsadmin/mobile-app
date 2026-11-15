import { getTimeSlots, roundToSlot, toTimeValue, withTime } from "./time-slots"

describe("toTimeValue", () => {
  it("pads hours and minutes", () => {
    expect(toTimeValue(new Date(2026, 5, 15, 7, 5))).toBe("07:05")
  })
})

describe("withTime", () => {
  it("keeps the day and replaces the time", () => {
    const result = withTime(new Date(2026, 5, 15, 3, 0), "14:30")

    expect(result).toEqual(new Date(2026, 5, 15, 14, 30))
  })
})

describe("roundToSlot", () => {
  const time = new Date("2026-06-15T10:10:00.000Z")

  it("rounds down to the previous half hour", () => {
    expect(roundToSlot(time, "floor").toISOString()).toBe(
      "2026-06-15T10:00:00.000Z",
    )
  })

  it("rounds up to the next half hour", () => {
    expect(roundToSlot(time, "ceil").toISOString()).toBe(
      "2026-06-15T10:30:00.000Z",
    )
  })

  it("keeps a time that is already on a slot", () => {
    const onSlot = new Date("2026-06-15T10:30:00.000Z")

    expect(roundToSlot(onSlot, "ceil")).toEqual(onSlot)
    expect(roundToSlot(onSlot, "floor")).toEqual(onSlot)
  })
})

describe("getTimeSlots", () => {
  it("returns 48 half-hour slots covering the whole day", () => {
    const slots = getTimeSlots("en")

    expect(slots).toHaveLength(48)
    expect(slots[0].value).toBe("00:00")
    expect(slots[1].value).toBe("00:30")
    expect(slots.at(-1)?.value).toBe("23:30")
  })

  it("labels each slot for the locale", () => {
    expect(getTimeSlots("en")[26].label).toMatch(/1:00\s?PM/)
  })
})
