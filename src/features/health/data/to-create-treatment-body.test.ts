import { TreatmentStatus, TreatmentType } from "@ipetsadmin/contracts"

import type { TreatmentValues } from "../schema/treatment.schema"
import { toCreateTreatmentBody } from "./to-create-treatment-body"

const now = new Date("2026-06-15T12:00:00.000Z")

const values: TreatmentValues = {
  treatmentType: TreatmentType.MEDICATION,
  name: "  Amoxicillin ",
  dosage: " 1 tablet ",
  startDate: new Date("2026-06-15T08:00:00.000Z"),
  frequencyHours: "8",
  durationDays: "5",
  instructions: "With food",
}

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(now)
})

afterEach(() => {
  jest.useRealTimers()
})

describe("toCreateTreatmentBody", () => {
  it("converts texts to numbers and trims names", () => {
    const body = toCreateTreatmentBody("user-1", values)

    expect(body).toMatchObject({
      ownerId: "user-1",
      medicationName: "Amoxicillin",
      dosage: "1 tablet",
      frequencyHours: 8,
      durationDays: 5,
      treatmentType: TreatmentType.MEDICATION,
      instructions: "With food",
    })
  })

  it("computes the total doses from frequency and duration", () => {
    expect(toCreateTreatmentBody("user-1", values).totalDoses).toBe(15)
  })

  it("rounds the total doses down", () => {
    const body = toCreateTreatmentBody("user-1", {
      ...values,
      frequencyHours: "7",
      durationDays: "1",
    })

    expect(body.totalDoses).toBe(3)
  })

  it("always schedules at least one dose", () => {
    const body = toCreateTreatmentBody("user-1", {
      ...values,
      frequencyHours: "48",
      durationDays: "1",
    })

    expect(body.totalDoses).toBe(1)
  })

  it("ends after the duration in days", () => {
    expect(toCreateTreatmentBody("user-1", values).endDate).toEqual(
      new Date("2026-06-20T08:00:00.000Z"),
    )
  })

  it("is in progress when it already started", () => {
    expect(toCreateTreatmentBody("user-1", values).status).toBe(
      TreatmentStatus.IN_PROGRESS,
    )
  })

  it("waits to start when the start date is in the future", () => {
    const body = toCreateTreatmentBody("user-1", {
      ...values,
      startDate: new Date("2026-06-16T08:00:00.000Z"),
    })

    expect(body.status).toBe(TreatmentStatus.WAITING_START)
  })

  it("sends no instructions when empty", () => {
    expect(
      toCreateTreatmentBody("user-1", { ...values, instructions: "" })
        .instructions,
    ).toBeUndefined()
  })
})
