import { Gender, WeightUnit } from "@ipetsadmin/contracts"

import { hasTranslationKey } from "@/test/translation-keys"

import { ageKeys, genderKeys, weightUnitKeys } from "./pet-labels"

describe("pet labels", () => {
  it("has a gender key for every gender", () => {
    expect(Object.keys(genderKeys).sort()).toEqual(Object.values(Gender).sort())
  })

  it("has a weight unit key for every unit", () => {
    expect(Object.keys(weightUnitKeys).sort()).toEqual(
      Object.values(WeightUnit).sort(),
    )
  })

  it.each([...Object.values(genderKeys), ...Object.values(weightUnitKeys)])(
    "%s is translated in every language",
    (key) => {
      expect(hasTranslationKey(key)).toBe(true)
    },
  )

  it.each(Object.values(ageKeys))(
    "%s has singular and plural forms in every language",
    (key) => {
      expect(hasTranslationKey(`${key}_one`)).toBe(true)
      expect(hasTranslationKey(`${key}_other`)).toBe(true)
    },
  )
})
