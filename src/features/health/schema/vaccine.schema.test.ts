import { getSchemaIssues } from "@/test/schema-issues"

import { vaccineSchema } from "./vaccine.schema"

const now = new Date("2026-06-15T12:00:00.000Z")

const valid = {
  name: "Rabies",
  administeredAt: new Date("2026-06-10T10:00:00.000Z"),
}

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(now)
})

afterEach(() => {
  jest.useRealTimers()
})

describe("vaccineSchema", () => {
  it("accepts a vaccine with only a name and a date", () => {
    expect(vaccineSchema.safeParse(valid).success).toBe(true)
  })

  it("accepts laboratory and lot together", () => {
    expect(
      vaccineSchema.safeParse({
        ...valid,
        laboratory: "Zoetis",
        lotNumber: "L-1",
      }).success,
    ).toBe(true)
  })

  it("requires the name", () => {
    expect(getSchemaIssues(vaccineSchema, { ...valid, name: "  " })).toEqual([
      { path: "name", message: "validation.required" },
    ])
  })

  it("requires the date", () => {
    expect(
      getSchemaIssues(vaccineSchema, { ...valid, administeredAt: undefined }),
    ).toEqual([{ path: "administeredAt", message: "validation.required" }])
  })

  it("accepts a vaccine administered later today", () => {
    expect(
      vaccineSchema.safeParse({
        ...valid,
        administeredAt: new Date("2026-06-15T20:00:00.000Z"),
      }).success,
    ).toBe(true)
  })

  it("rejects a date after today", () => {
    expect(
      getSchemaIssues(vaccineSchema, {
        ...valid,
        administeredAt: new Date("2026-06-16T10:00:00.000Z"),
      }),
    ).toEqual([{ path: "administeredAt", message: "validation.notFuture" }])
  })

  it("requires the lot when only the laboratory is filled", () => {
    expect(
      getSchemaIssues(vaccineSchema, { ...valid, laboratory: "Zoetis" }),
    ).toEqual([{ path: "lotNumber", message: "validation.required" }])
  })

  it("requires the laboratory when only the lot is filled", () => {
    expect(
      getSchemaIssues(vaccineSchema, { ...valid, lotNumber: "L-1" }),
    ).toEqual([{ path: "laboratory", message: "validation.required" }])
  })

  it("treats blank laboratory and lot as not filled", () => {
    expect(
      vaccineSchema.safeParse({ ...valid, laboratory: "  ", lotNumber: "" })
        .success,
    ).toBe(true)
  })
})
