import {
  BeenWithSource,
  BirthDateSource,
  type PetResponse,
} from "@ipetsadmin/contracts";

import {
  BirthDateMode,
  TogetherMode,
  type CompanionValues,
} from "../schema/companion.schema";
import { fromContractReason } from "./not-neutered-reasons";

export function toCompanionValues(pet: PetResponse): CompanionValues {
  return {
    species: pet.species,
    name: pet.name,
    breed: pet.breed,
    gender: pet.gender,
    birth: {
      mode:
        pet.birthDate.source === BirthDateSource.EXACT_DATE
          ? BirthDateMode.EXACT
          : BirthDateMode.UNSURE,
      date: pet.birthDate.date,
    },
    together: {
      mode:
        pet.beenWithUsSince.source === BeenWithSource.SINCE_BIRTH
          ? TogetherMode.SINCE_BIRTH
          : TogetherMode.JOINED_LATER,
      date: pet.beenWithUsSince.date,
    },
    weight: String(pet.weight),
    weightUnit: pet.weightUnit,
    isNeutered: pet.isNeutered === true,
    notNeuteredReason: pet.notNeuteredReason
      ? fromContractReason[pet.notNeuteredReason]
      : undefined,
    microchipNumber: pet.microchipNumber ?? "",
    photoUri: pet.photos[0]?.url,
  };
}
