import {
  makeAppointmentItem,
  makeBirthdayItem,
  makeDoseItem,
} from "@/test/factories/make-agenda-item"
import { makeAppointment } from "@/test/factories/make-appointment"

import { getAgendaItemKey, sortAgendaItems } from "./sort-agenda-items"

describe("sortAgendaItems", () => {
  it("orders items from the earliest to the latest", () => {
    const late = makeDoseItem({ occursAt: new Date("2026-06-20T10:00:00Z") })
    const early = makeBirthdayItem({
      occursAt: new Date("2026-06-16T00:00:00Z"),
    })

    const sorted = sortAgendaItems([late, early])

    expect(sorted.map((item) => item.type)).toEqual([early.type, late.type])
  })

  it("converts serialized dates into Date objects", () => {
    const item = makeDoseItem({
      occursAt: "2026-06-20T10:00:00.000Z" as unknown as Date,
    })

    const [sorted] = sortAgendaItems([item])

    expect(sorted.occursAt).toBeInstanceOf(Date)
    expect(sorted.occursAt.toISOString()).toBe("2026-06-20T10:00:00.000Z")
  })

  it("does not mutate the received list", () => {
    const first = makeDoseItem({ occursAt: new Date("2026-06-20T10:00:00Z") })
    const second = makeDoseItem({ occursAt: new Date("2026-06-16T10:00:00Z") })
    const items = [first, second]

    sortAgendaItems(items)

    expect(items).toEqual([first, second])
  })
})

describe("getAgendaItemKey", () => {
  it("uses the appointment id", () => {
    const item = makeAppointmentItem({
      appointment: makeAppointment({ id: "appointment-9" }),
    })

    expect(getAgendaItemKey(item)).toBe("appointment-appointment-9")
  })

  it("uses the dose id", () => {
    const item = makeDoseItem()

    expect(getAgendaItemKey(item)).toBe(`dose-${item.dose.id}`)
  })

  it("combines pet and date for a birthday", () => {
    const item = makeBirthdayItem({
      petId: "pet-7",
      occursAt: new Date("2026-06-20T00:00:00.000Z"),
    })

    expect(getAgendaItemKey(item)).toBe(
      "birthday-pet-7-2026-06-20T00:00:00.000Z",
    )
  })
})
