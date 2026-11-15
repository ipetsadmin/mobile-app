import { makePet } from "@/test/factories/make-pet"

import { parsePet } from "./parse-pet"

describe("parsePet", () => {
  it("converts serialized dates into Date objects", () => {
    const serialized = makePet({
      birthDate: {
        ...makePet().birthDate,
        date: "2023-03-10T12:00:00.000Z" as unknown as Date,
      },
      beenWithUsSince: {
        ...makePet().beenWithUsSince,
        date: "2023-05-01T12:00:00.000Z" as unknown as Date,
      },
    })

    const pet = parsePet(serialized)

    expect(pet.birthDate.date).toBeInstanceOf(Date)
    expect(pet.birthDate.date.toISOString()).toBe("2023-03-10T12:00:00.000Z")
    expect(pet.beenWithUsSince.date).toBeInstanceOf(Date)
    expect(pet.beenWithUsSince.date.toISOString()).toBe(
      "2023-05-01T12:00:00.000Z",
    )
  })

  it("keeps the rest of the pet and the date sources", () => {
    const original = makePet()

    const pet = parsePet(original)

    expect(pet).toEqual(original)
    expect(pet.birthDate.source).toBe(original.birthDate.source)
  })

  it("does not mutate the original pet", () => {
    const original = makePet({
      birthDate: {
        ...makePet().birthDate,
        date: "2023-03-10T12:00:00.000Z" as unknown as Date,
      },
    })

    parsePet(original)

    expect(typeof original.birthDate.date).toBe("string")
  })
})
