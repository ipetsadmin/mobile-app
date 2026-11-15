import { TreatmentStatus } from "@ipetsadmin/contracts"

import { hasTranslationKey } from "@/test/translation-keys"

import {
  isFinishedTreatment,
  treatmentStatusKeys,
} from "./treatment-status-keys"

describe("treatmentStatusKeys", () => {
  it("has a key for every treatment status", () => {
    expect(Object.keys(treatmentStatusKeys).sort()).toEqual(
      Object.values(TreatmentStatus).sort(),
    )
  })

  it.each(Object.entries(treatmentStatusKeys))(
    "%s points to a key translated in every language",
    (_status, key) => {
      expect(hasTranslationKey(key)).toBe(true)
    },
  )
})

describe("isFinishedTreatment", () => {
  it.each([TreatmentStatus.COMPLETED, TreatmentStatus.CANCELLED])(
    "is true for %s",
    (status) => {
      expect(isFinishedTreatment(status)).toBe(true)
    },
  )

  it.each([
    TreatmentStatus.WAITING_START,
    TreatmentStatus.PENDING,
    TreatmentStatus.IN_PROGRESS,
  ])("is false for %s", (status) => {
    expect(isFinishedTreatment(status)).toBe(false)
  })
})
