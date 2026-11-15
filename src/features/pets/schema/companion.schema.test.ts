import { CatBreed, DogBreed, Species } from "@ipetsadmin/contracts"

import { makeCompanionValues } from "@/test/factories/make-companion-values"
import { getSchemaIssues } from "@/test/schema-issues"

import { companionSchema } from "./companion.schema"

const issues = (overrides: Record<string, unknown>) =>
  getSchemaIssues(companionSchema, { ...makeCompanionValues(), ...overrides })

describe("companionSchema", () => {
  it("accepts a complete companion", () => {
    expect(companionSchema.safeParse(makeCompanionValues()).success).toBe(true)
  })

  it("requires a name and trims it", () => {
    expect(issues({ name: "   " })).toEqual([
      { path: "name", message: "validation.required" },
    ])
  })

  it("requires a species, a gender and a weight unit", () => {
    expect(issues({ species: "Bird" })).toContainEqual({
      path: "species",
      message: "validation.selectOption",
    })
    expect(issues({ gender: "Other" })).toEqual([
      { path: "gender", message: "validation.selectOption" },
    ])
    expect(issues({ weightUnit: "OZ" })).toEqual([
      { path: "weightUnit", message: "validation.selectOption" },
    ])
  })
})

describe("breed", () => {
  it("accepts a cat breed for a cat", () => {
    expect(
      companionSchema.safeParse(
        makeCompanionValues({ species: Species.CAT, breed: CatBreed.PERSA }),
      ).success,
    ).toBe(true)
  })

  it("rejects a dog breed for a cat", () => {
    expect(
      issues({ species: Species.CAT, breed: DogBreed.LABRADOR_RETRIEVER }),
    ).toEqual([{ path: "breed", message: "validation.breedMismatch" }])
  })

  it("rejects a cat breed for a dog", () => {
    expect(issues({ species: Species.DOG, breed: CatBreed.PERSA })).toEqual([
      { path: "breed", message: "validation.breedMismatch" },
    ])
  })

  it("requires a breed", () => {
    expect(issues({ breed: undefined })).toContainEqual({
      path: "breed",
      message: "validation.required",
    })
  })
})

describe("weight", () => {
  it.each(["12", "12.5", "12,5", "0.5"])("accepts %s", (weight) => {
    expect(
      companionSchema.safeParse(makeCompanionValues({ weight })).success,
    ).toBe(true)
  })

  it.each(["abc", "-3", "1.", ".5", "1,2,3"])("rejects %p", (weight) => {
    const messages = issues({ weight }).map((issue) => issue.message)

    expect(messages.length).toBeGreaterThan(0)
    expect(new Set(messages)).toEqual(new Set(["validation.weightInvalid"]))
  })

  it("rejects zero", () => {
    expect(issues({ weight: "0" })).toEqual([
      { path: "weight", message: "validation.weightInvalid" },
    ])
  })

  it("requires a weight", () => {
    expect(issues({ weight: "" })[0]).toEqual({
      path: "weight",
      message: "validation.required",
    })
  })
})

describe("microchip", () => {
  it.each([undefined, "", "985 112 000 123", "985112000123"])(
    "accepts %p",
    (microchipNumber) => {
      expect(
        companionSchema.safeParse(makeCompanionValues({ microchipNumber }))
          .success,
      ).toBe(true)
    },
  )

  it.each(["abc123", "985-112", "12.3"])("rejects %p", (microchipNumber) => {
    expect(issues({ microchipNumber })).toEqual([
      { path: "microchipNumber", message: "validation.microchipInvalid" },
    ])
  })
})
