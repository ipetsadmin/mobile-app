import { DogBreed, Gender, Species, WeightUnit } from "@ipetsadmin/contracts"

import { makeCompanionValues } from "@/test/factories/make-companion-values"
import { getSchemaIssues } from "@/test/schema-issues"
import { hasTranslationKey } from "@/test/translation-keys"

import {
  BirthDateMode,
  companionSchema,
  NotNeuteredReason,
  TogetherMode,
} from "./companion.schema"

const now = new Date("2026-06-15T12:00:00.000Z")

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(now)
})

afterEach(() => {
  jest.useRealTimers()
})

const issues = (overrides: Record<string, unknown>) =>
  getSchemaIssues(companionSchema, { ...makeCompanionValues(), ...overrides })

describe("dates", () => {
  it("rejects a birth date after today", () => {
    expect(
      issues({
        birth: {
          mode: BirthDateMode.EXACT,
          date: new Date("2026-06-16T10:00:00Z"),
        },
      }),
    ).toContainEqual({ path: "birth.date", message: "validation.notFuture" })
  })

  it("accepts a birth date later today", () => {
    expect(
      companionSchema.safeParse(
        makeCompanionValues({
          birth: {
            mode: BirthDateMode.EXACT,
            date: new Date("2026-06-15T20:00:00Z"),
          },
          together: {
            mode: TogetherMode.SINCE_BIRTH,
            date: new Date("2026-06-15T20:00:00Z"),
          },
        }),
      ).success,
    ).toBe(true)
  })

  it("rejects a together date after today", () => {
    expect(
      issues({
        together: {
          mode: TogetherMode.JOINED_LATER,
          date: new Date("2026-06-16T10:00:00Z"),
        },
      }),
    ).toContainEqual({ path: "together.date", message: "validation.notFuture" })
  })

  it("rejects living together before the birth", () => {
    expect(
      issues({
        birth: {
          mode: BirthDateMode.EXACT,
          date: new Date("2024-01-10T10:00:00Z"),
        },
        together: {
          mode: TogetherMode.JOINED_LATER,
          date: new Date("2024-01-09T10:00:00Z"),
        },
      }),
    ).toEqual([{ path: "together.date", message: "validation.beforeBirth" }])
  })

  it("accepts living together from the same day as the birth", () => {
    expect(
      companionSchema.safeParse(
        makeCompanionValues({
          birth: {
            mode: BirthDateMode.EXACT,
            date: new Date("2024-01-10T08:00:00Z"),
          },
          together: {
            mode: TogetherMode.SINCE_BIRTH,
            date: new Date("2024-01-10T20:00:00Z"),
          },
        }),
      ).success,
    ).toBe(true)
  })

  it("requires the modes", () => {
    expect(
      issues({ birth: { mode: "maybe", date: new Date("2024-01-10") } }),
    ).toContainEqual({ path: "birth.mode", message: "validation.selectOption" })
  })
})

describe("neutering", () => {
  it("requires a reason when the pet is not neutered", () => {
    expect(issues({ isNeutered: false })).toEqual([
      { path: "notNeuteredReason", message: "validation.selectOption" },
    ])
  })

  it("accepts a reason when the pet is not neutered", () => {
    expect(
      companionSchema.safeParse(
        makeCompanionValues({
          isNeutered: false,
          notNeuteredReason: NotNeuteredReason.TOO_YOUNG,
        }),
      ).success,
    ).toBe(true)
  })

  it("does not require a reason when the pet is neutered", () => {
    expect(issues({ isNeutered: true, notNeuteredReason: undefined })).toEqual(
      [],
    )
  })
})

describe("translations", () => {
  it("reports only translated messages", () => {
    const all = getSchemaIssues(companionSchema, {
      species: Species.CAT,
      name: "",
      breed: DogBreed.LABRADOR_RETRIEVER,
      gender: Gender.FEMALE,
      birth: {
        mode: BirthDateMode.EXACT,
        date: new Date("2026-06-16T10:00:00Z"),
      },
      together: {
        mode: TogetherMode.JOINED_LATER,
        date: new Date("2026-06-17T10:00:00Z"),
      },
      weight: "abc",
      weightUnit: WeightUnit.KG,
      isNeutered: false,
      microchipNumber: "x",
    })

    expect(all.length).toBeGreaterThan(3)
    expect(all.filter((issue) => !hasTranslationKey(issue.message))).toEqual([])
  })
})
