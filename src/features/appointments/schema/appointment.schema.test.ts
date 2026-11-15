import { AppointmentType } from "@ipetsadmin/contracts"

import { getSchemaIssues } from "@/test/schema-issues"
import { hasTranslationKey } from "@/test/translation-keys"

import { appointmentSchema } from "./appointment.schema"

const now = new Date("2026-06-15T12:00:00.000Z")

const valid = {
  appointmentType: AppointmentType.VETERINARY,
  scheduledAt: new Date("2026-06-20T10:00:00.000Z"),
  providerName: "Dr. Smith",
  locationName: "Happy Paws",
  address: "1 Main St",
  city: "Bogota",
}

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(now)
})

afterEach(() => {
  jest.useRealTimers()
})

describe("appointmentSchema", () => {
  it("accepts a complete appointment without a reason", () => {
    expect(appointmentSchema.safeParse(valid).success).toBe(true)
  })

  it("accepts an optional reason", () => {
    expect(
      appointmentSchema.safeParse({ ...valid, reason: "Checkup" }).success,
    ).toBe(true)
  })

  it("requires a known appointment type", () => {
    expect(
      getSchemaIssues(appointmentSchema, { ...valid, appointmentType: "spa" }),
    ).toEqual([{ path: "appointmentType", message: "validation.selectOption" }])
  })

  it("requires a date", () => {
    expect(
      getSchemaIssues(appointmentSchema, { ...valid, scheduledAt: undefined }),
    ).toEqual([{ path: "scheduledAt", message: "validation.required" }])
  })

  it("rejects a date in the past", () => {
    expect(
      getSchemaIssues(appointmentSchema, {
        ...valid,
        scheduledAt: new Date("2026-06-14T12:00:00.000Z"),
      }),
    ).toEqual([{ path: "scheduledAt", message: "validation.mustBeFuture" }])
  })

  it("rejects the current instant, which is not in the future", () => {
    expect(
      getSchemaIssues(appointmentSchema, { ...valid, scheduledAt: now }),
    ).toEqual([{ path: "scheduledAt", message: "validation.mustBeFuture" }])
  })

  it.each(["providerName", "locationName", "address", "city"] as const)(
    "requires %s and rejects blank text",
    (field) => {
      expect(
        getSchemaIssues(appointmentSchema, { ...valid, [field]: "   " }),
      ).toEqual([{ path: field, message: "validation.required" }])
    },
  )

  it("reports translated messages", () => {
    const issues = getSchemaIssues(appointmentSchema, {})

    expect(issues.length).toBeGreaterThan(0)
    expect(issues.filter((issue) => !hasTranslationKey(issue.message))).toEqual(
      [],
    )
  })
})
