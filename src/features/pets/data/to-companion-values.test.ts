import {
  BeenWithSource,
  BirthDateSource,
  NotNeuteredReason as ContractReason,
} from "@ipetsadmin/contracts"

import { makePet } from "@/test/factories/make-pet"

import {
  BirthDateMode,
  NotNeuteredReason,
  TogetherMode,
} from "../schema/companion.schema"
import { toCompanionValues } from "./to-companion-values"

describe("toCompanionValues", () => {
  it("copies the basic fields", () => {
    const pet = makePet({ name: "Luna" })

    expect(toCompanionValues(pet)).toMatchObject({
      species: pet.species,
      name: "Luna",
      breed: pet.breed,
      gender: pet.gender,
      weightUnit: pet.weightUnit,
    })
  })

  it("turns the weight into text", () => {
    expect(toCompanionValues(makePet({ weight: 12.5 })).weight).toBe("12.5")
  })

  it.each([
    [BirthDateSource.EXACT_DATE, BirthDateMode.EXACT],
    [BirthDateSource.APPROXIMATED_DATE, BirthDateMode.UNSURE],
  ])("maps the birth source %s", (source, mode) => {
    const pet = makePet({ birthDate: { ...makePet().birthDate, source } })

    expect(toCompanionValues(pet).birth.mode).toBe(mode)
  })

  it.each([
    [BeenWithSource.SINCE_BIRTH, TogetherMode.SINCE_BIRTH],
    [BeenWithSource.JOINED_LATER, TogetherMode.JOINED_LATER],
  ])("maps the together source %s", (source, mode) => {
    const pet = makePet({
      beenWithUsSince: { ...makePet().beenWithUsSince, source },
    })

    expect(toCompanionValues(pet).together.mode).toBe(mode)
  })

  it("keeps the dates", () => {
    const pet = makePet()
    const values = toCompanionValues(pet)

    expect(values.birth.date).toBe(pet.birthDate.date)
    expect(values.together.date).toBe(pet.beenWithUsSince.date)
  })

  it("maps the not neutered reason", () => {
    const pet = makePet({
      isNeutered: false,
      notNeuteredReason: ContractReason.HEALTH_CONCERNS,
    })

    const values = toCompanionValues(pet)

    expect(values.isNeutered).toBe(false)
    expect(values.notNeuteredReason).toBe(NotNeuteredReason.HEALTH_CONCERNS)
  })

  it("has no reason when none was stored", () => {
    expect(toCompanionValues(makePet()).notNeuteredReason).toBeUndefined()
  })

  it("uses an empty microchip when the pet has none", () => {
    expect(toCompanionValues(makePet()).microchipNumber).toBe("")
    expect(
      toCompanionValues(makePet({ microchipNumber: "985112000123" }))
        .microchipNumber,
    ).toBe("985112000123")
  })

  it("uses the first photo url", () => {
    const pet = makePet({
      photos: [
        { objectKey: "a", url: "https://img/a.jpg" },
        { objectKey: "b", url: "https://img/b.jpg" },
      ],
    })

    expect(toCompanionValues(pet).photoUri).toBe("https://img/a.jpg")
    expect(toCompanionValues(makePet()).photoUri).toBeUndefined()
  })
})
