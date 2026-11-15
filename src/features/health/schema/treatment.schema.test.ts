import { TreatmentType } from "@ipetsadmin/contracts"

import { getSchemaIssues } from "@/test/schema-issues"

import { treatmentSchema } from "./treatment.schema"

const valid = {
  treatmentType: TreatmentType.MEDICATION,
  name: "Amoxicillin",
  dosage: "1 tablet",
  startDate: new Date("2026-06-15T08:00:00.000Z"),
  frequencyHours: "8",
  durationDays: "5",
}

describe("treatmentSchema", () => {
  it("accepts a complete treatment without instructions", () => {
    expect(treatmentSchema.safeParse(valid).success).toBe(true)
  })

  it("accepts instructions", () => {
    expect(
      treatmentSchema.safeParse({ ...valid, instructions: "With food" })
        .success,
    ).toBe(true)
  })

  it("requires a known treatment type", () => {
    expect(
      getSchemaIssues(treatmentSchema, { ...valid, treatmentType: "magic" }),
    ).toEqual([{ path: "treatmentType", message: "validation.selectOption" }])
  })

  it.each(["name", "dosage"] as const)("requires %s", (field) => {
    expect(
      getSchemaIssues(treatmentSchema, { ...valid, [field]: "  " }),
    ).toEqual([{ path: field, message: "validation.required" }])
  })

  it("requires the start date", () => {
    expect(
      getSchemaIssues(treatmentSchema, { ...valid, startDate: undefined }),
    ).toEqual([{ path: "startDate", message: "validation.required" }])
  })

  it.each(["frequencyHours", "durationDays"] as const)(
    "accepts a positive integer in %s",
    (field) => {
      expect(
        treatmentSchema.safeParse({ ...valid, [field]: "12" }).success,
      ).toBe(true)
    },
  )

  it.each(["0", "-1", "1.5", "abc", "08", "1 2"])(
    "rejects %p as a positive integer",
    (value) => {
      expect(
        getSchemaIssues(treatmentSchema, { ...valid, frequencyHours: value }),
      ).toEqual([
        { path: "frequencyHours", message: "validation.positiveInteger" },
      ])
    },
  )

  it("requires the duration", () => {
    expect(
      getSchemaIssues(treatmentSchema, { ...valid, durationDays: "" }),
    ).toEqual([{ path: "durationDays", message: "validation.positiveInteger" }])
  })
})
