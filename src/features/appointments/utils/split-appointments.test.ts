import { AppointmentStatus } from "@ipetsadmin/contracts"

import { makeAppointment } from "@/test/factories/make-appointment"

import { splitAppointments } from "./split-appointments"

const now = new Date("2026-06-15T12:00:00.000Z")

const at = (scheduledAt: string, status = AppointmentStatus.PENDING) =>
  makeAppointment({
    id: scheduledAt,
    scheduledAt: new Date(scheduledAt),
    status,
  })

describe("splitAppointments", () => {
  it("returns two empty lists without appointments", () => {
    expect(splitAppointments([], now)).toEqual({ upcoming: [], past: [] })
  })

  it("puts future open appointments in upcoming, soonest first", () => {
    const later = at("2026-06-20T10:00:00.000Z")
    const sooner = at("2026-06-16T10:00:00.000Z")

    const { upcoming, past } = splitAppointments([later, sooner], now)

    expect(upcoming).toEqual([sooner, later])
    expect(past).toEqual([])
  })

  it("puts earlier appointments in past, most recent first", () => {
    const old = at("2026-06-01T10:00:00.000Z")
    const recent = at("2026-06-10T10:00:00.000Z")

    const { upcoming, past } = splitAppointments([old, recent], now)

    expect(upcoming).toEqual([])
    expect(past).toEqual([recent, old])
  })

  it.each([AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED])(
    "puts a future %s appointment in past",
    (status) => {
      const closed = at("2026-06-20T10:00:00.000Z", status)

      const { upcoming, past } = splitAppointments([closed], now)

      expect(upcoming).toEqual([])
      expect(past).toEqual([closed])
    },
  )

  it("keeps a confirmed future appointment in upcoming", () => {
    const confirmed = at(
      "2026-06-20T10:00:00.000Z",
      AppointmentStatus.CONFIRMED,
    )

    expect(splitAppointments([confirmed], now).upcoming).toEqual([confirmed])
  })

  it("treats an appointment at the exact current time as upcoming", () => {
    const exact = at("2026-06-15T12:00:00.000Z")

    expect(splitAppointments([exact], now).upcoming).toEqual([exact])
  })

  it("compares serialized dates by their time", () => {
    const serialized = makeAppointment({
      scheduledAt: "2026-06-20T10:00:00.000Z" as unknown as Date,
    })

    expect(splitAppointments([serialized], now).upcoming).toEqual([serialized])
  })
})
