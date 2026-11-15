import { DogBreed, Gender, Species, WeightUnit } from "@ipetsadmin/contracts"

import {
  BirthDateMode,
  type CompanionValues,
  TogetherMode,
} from "@/features/pets/schema/companion.schema"

export function makeCompanionValues(
  overrides: Partial<CompanionValues> = {},
): CompanionValues {
  return {
    species: Species.DOG,
    name: "Luna",
    breed: DogBreed.LABRADOR_RETRIEVER,
    gender: Gender.FEMALE,
    birth: {
      mode: BirthDateMode.EXACT,
      date: new Date("2023-03-10T08:00:00.000Z"),
    },
    together: {
      mode: TogetherMode.JOINED_LATER,
      date: new Date("2023-05-01T20:00:00.000Z"),
    },
    weight: "12.5",
    weightUnit: WeightUnit.KG,
    isNeutered: true,
    microchipNumber: "",
    ...overrides,
  }
}
