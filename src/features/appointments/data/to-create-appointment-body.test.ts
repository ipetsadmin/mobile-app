import { AppointmentStatus, AppointmentType } from "@ipetsadmin/contracts"

import type { AppointmentValues } from "../schema/appointment.schema"
import { toCreateAppointmentBody } from "./to-create-appointment-body"

const scheduledAt = new Date("2026-06-20T10:00:00.000Z")

const values: AppointmentValues = {
  appointmentType: AppointmentType.DENTAL,
  scheduledAt,
  providerName: "  Dr. Smith ",
  locationName: " Happy Paws ",
  address: " 1 Main St ",
  city: " Bogota ",
  reason: "Checkup",
}

describe("toCreateAppointmentBody", () => {
  it("builds a pending appointment for the owner", () => {
    const body = toCreateAppointmentBody("user-1", values)

    expect(body.ownerId).toBe("user-1")
    expect(body.status).toBe(AppointmentStatus.PENDING)
    expect(body.appointmentType).toBe(AppointmentType.DENTAL)
    expect(body.scheduledAt).toBe(scheduledAt)
  })

  it("trims provider and location texts", () => {
    const body = toCreateAppointmentBody("user-1", values)

    expect(body.provider).toEqual({ name: "Dr. Smith" })
    expect(body.location).toEqual({
      locationName: "Happy Paws",
      address: "1 Main St",
      city: "Bogota",
    })
  })

  it("keeps the reason when there is one", () => {
    expect(toCreateAppointmentBody("user-1", values).reason).toBe("Checkup")
  })

  it.each(["", undefined])("sends no reason for %p", (reason) => {
    expect(
      toCreateAppointmentBody("user-1", { ...values, reason }).reason,
    ).toBeUndefined()
  })
})
