import {
  makeAppointmentItem,
  makeBirthdayItem,
  makeDoseItem,
} from "@/test/factories/make-agenda-item"

import { getAgendaItemSymbol } from "./agenda-item-symbol"

describe("getAgendaItemSymbol", () => {
  it("returns a calendar symbol for appointments", () => {
    expect(getAgendaItemSymbol(makeAppointmentItem()).ios).toBe("calendar")
  })

  it("returns a pills symbol for treatment doses", () => {
    expect(getAgendaItemSymbol(makeDoseItem()).ios).toBe("pills")
  })

  it("returns a gift symbol for birthdays", () => {
    expect(getAgendaItemSymbol(makeBirthdayItem()).ios).toBe("gift")
  })

  it("defines a symbol for every platform", () => {
    const symbol = getAgendaItemSymbol(makeDoseItem())

    expect(symbol.android).toBeTruthy()
    expect(symbol.web).toBeTruthy()
  })
})
