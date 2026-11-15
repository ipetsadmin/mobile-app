import { AppointmentStatus } from "@ipetsadmin/contracts"

import { hasTranslationKey } from "@/test/translation-keys"

import { appointmentStatusKeys } from "./appointment-status-keys"

describe("appointmentStatusKeys", () => {
  it("has a key for every appointment status", () => {
    expect(Object.keys(appointmentStatusKeys).sort()).toEqual(
      Object.values(AppointmentStatus).sort(),
    )
  })

  it.each(Object.entries(appointmentStatusKeys))(
    "%s points to a key translated in every language",
    (_status, key) => {
      expect(hasTranslationKey(key)).toBe(true)
    },
  )
})
