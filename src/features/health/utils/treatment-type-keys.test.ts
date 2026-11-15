import { TreatmentType } from "@ipetsadmin/contracts"

import { hasTranslationKey } from "@/test/translation-keys"

import {
  selectableTreatmentTypes,
  treatmentTypeKeys,
} from "./treatment-type-keys"

describe("treatmentTypeKeys", () => {
  it("has a key for every treatment type", () => {
    expect(Object.keys(treatmentTypeKeys).sort()).toEqual(
      Object.values(TreatmentType).sort(),
    )
  })

  it.each(Object.entries(treatmentTypeKeys))(
    "%s points to a key translated in every language",
    (_type, key) => {
      expect(hasTranslationKey(key)).toBe(true)
    },
  )
})

describe("selectableTreatmentTypes", () => {
  it("excludes vaccination, which has its own form", () => {
    expect(selectableTreatmentTypes).not.toContain(TreatmentType.VACCINATION)
  })

  it("includes every other treatment type", () => {
    expect(selectableTreatmentTypes).toHaveLength(
      Object.values(TreatmentType).length - 1,
    )
  })
})
