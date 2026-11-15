import { AppointmentType } from "@ipetsadmin/contracts"

import { hasTranslationKey } from "@/test/translation-keys"

import { appointmentTypeKeys } from "./appointment-type-keys"

describe("appointmentTypeKeys", () => {
  it("has a key for every appointment type", () => {
    expect(Object.keys(appointmentTypeKeys).sort()).toEqual(
      Object.values(AppointmentType).sort(),
    )
  })

  it.each(Object.entries(appointmentTypeKeys))(
    "%s points to a key translated in every language",
    (_type, key) => {
      expect(hasTranslationKey(key)).toBe(true)
    },
  )
})
