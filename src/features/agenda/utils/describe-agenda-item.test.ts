import { i18n } from "@/lib/i18n"
import {
  makeAppointmentItem,
  makeBirthdayItem,
  makeDoseItem,
} from "@/test/factories/make-agenda-item"
import { makeAppointment } from "@/test/factories/make-appointment"

import { describeAgendaItem } from "./describe-agenda-item"

const t = i18n.getFixedT("en")

describe("describeAgendaItem", () => {
  it("describes an appointment with its provider and date", () => {
    const item = makeAppointmentItem({
      petName: "Luna",
      appointment: makeAppointment({ provider: { name: "Dr. Smith" } }),
      occursAt: new Date(2026, 5, 20, 10, 0),
    })

    const { title, detail } = describeAgendaItem(item, t, "en")

    expect(title).toBe("Luna · appointment")
    expect(detail).toMatch(/^Dr\. Smith · Jun 20, 2026.*10:00\s?AM$/)
  })

  it("shows only the time when timeOnly is set", () => {
    const item = makeAppointmentItem({ occursAt: new Date(2026, 5, 20, 10, 0) })

    const { detail } = describeAgendaItem(item, t, "en", { timeOnly: true })

    expect(detail).toMatch(/^Dr\. Smith · 10:00\s?AM$/)
  })

  it("describes a treatment dose with medication and pet", () => {
    const item = makeDoseItem({
      medicationName: "Amoxicillin",
      petName: "Luna",
      occursAt: new Date(2026, 5, 20, 8, 0),
    })

    const { title, detail } = describeAgendaItem(item, t, "en", {
      timeOnly: true,
    })

    expect(title).toBe("Amoxicillin · Luna")
    expect(detail).toMatch(/8:00\s?AM/)
  })

  it("describes a birthday with the age and the date", () => {
    const item = makeBirthdayItem({
      petName: "Luna",
      ageTurning: 3,
      occursAt: new Date(2026, 5, 20),
    })

    const { title, detail } = describeAgendaItem(item, t, "en")

    expect(title).toBe("Luna turns 3")
    expect(detail).toBe("Jun 20, 2026")
  })

  it("shows all day for a birthday when timeOnly is set", () => {
    const item = makeBirthdayItem()

    const { detail } = describeAgendaItem(item, t, "en", { timeOnly: true })

    expect(detail).toBe("All day")
  })
})
