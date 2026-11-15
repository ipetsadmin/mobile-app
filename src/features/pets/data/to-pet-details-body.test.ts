import {
  BeenWithSource,
  BirthDateSource,
  NotNeuteredReason as ContractReason,
} from "@ipetsadmin/contracts"

import { makeCompanionValues } from "@/test/factories/make-companion-values"

import {
  BirthDateMode,
  NotNeuteredReason,
  TogetherMode,
} from "../schema/companion.schema"
import { toPetDetailsBody } from "./to-pet-details-body"

describe("toPetDetailsBody", () => {
  it("trims the name and keeps the basic fields", () => {
    const values = makeCompanionValues({ name: "  Luna " })

    const body = toPetDetailsBody(values)

    expect(body).toMatchObject({
      name: "Luna",
      species: values.species,
      breed: values.breed,
      gender: values.gender,
      weightUnit: values.weightUnit,
    })
  })

  it("moves dates to noon to avoid timezone day shifts", () => {
    const body = toPetDetailsBody(makeCompanionValues())

    expect(body.birthDate.date).toEqual(new Date(2023, 2, 10, 12))
    expect(body.beenWithUsSince.date).toEqual(new Date(2023, 4, 1, 12))
  })

  it("maps an exact birth date and an approximate one", () => {
    const exact = toPetDetailsBody(makeCompanionValues())
    const unsure = toPetDetailsBody(
      makeCompanionValues({
        birth: { mode: BirthDateMode.UNSURE, date: new Date(2023, 2, 10) },
      }),
    )

    expect(exact.birthDate.source).toBe(BirthDateSource.EXACT_DATE)
    expect(unsure.birthDate.source).toBe(BirthDateSource.APPROXIMATED_DATE)
  })

  it("maps the time together modes", () => {
    const sinceBirth = toPetDetailsBody(
      makeCompanionValues({
        together: {
          mode: TogetherMode.SINCE_BIRTH,
          date: new Date(2023, 2, 10),
        },
      }),
    )
    const later = toPetDetailsBody(makeCompanionValues())

    expect(sinceBirth.beenWithUsSince.source).toBe(BeenWithSource.SINCE_BIRTH)
    expect(later.beenWithUsSince.source).toBe(BeenWithSource.JOINED_LATER)
  })

  it.each([
    ["12.5", 12.5],
    ["12,5", 12.5],
    ["8", 8],
  ])("parses the weight %s", (weight, expected) => {
    expect(toPetDetailsBody(makeCompanionValues({ weight })).weight).toBe(
      expected,
    )
  })

  it("removes whitespace from the microchip number", () => {
    const body = toPetDetailsBody(
      makeCompanionValues({ microchipNumber: "985 112 000 123" }),
    )

    expect(body.microchipNumber).toBe("985112000123")
  })

  it.each(["", "   ", undefined])("sends no microchip for %p", (microchip) => {
    const body = toPetDetailsBody(
      makeCompanionValues({ microchipNumber: microchip }),
    )

    expect(body.microchipNumber).toBeUndefined()
  })

  it("sends no reason when the pet is neutered", () => {
    const body = toPetDetailsBody(
      makeCompanionValues({
        isNeutered: true,
        notNeuteredReason: NotNeuteredReason.TOO_YOUNG,
      }),
    )

    expect(body.isNeutered).toBe(true)
    expect(body.notNeuteredReason).toBeUndefined()
  })

  it("sends the contract reason when the pet is not neutered", () => {
    const body = toPetDetailsBody(
      makeCompanionValues({
        isNeutered: false,
        notNeuteredReason: NotNeuteredReason.TOO_YOUNG,
      }),
    )

    expect(body.isNeutered).toBe(false)
    expect(body.notNeuteredReason).toBe(ContractReason.TOO_YOUNG)
  })
})
