import type { PutPetDetailsBody } from "@ipetsadmin/api-client";
import {
  BeenWithSource,
  type CatBreed,
  type DogBreed,
  BirthDateSource,
} from "@ipetsadmin/contracts";

import { toNoon } from "@/utils/calendar";

import {
  BirthDateMode,
  TogetherMode,
  type CompanionValues,
} from "../schema/companion.schema";
import { toContractReason } from "./not-neutered-reasons";

export function toPetDetailsBody(values: CompanionValues) {
  const isNeutered = values.isNeutered === true;
  const microchipNumber = values.microchipNumber?.replace(/\s/g, "");

  return {
    name: values.name.trim(),
    species: values.species,
    breed: values.breed as DogBreed | CatBreed,
    gender: values.gender,
    birthDate: {
      date: toNoon(values.birth.date),
      source:
        values.birth.mode === BirthDateMode.EXACT
          ? BirthDateSource.EXACT_DATE
          : BirthDateSource.APPROXIMATED_DATE,
    },
    beenWithUsSince: {
      date: toNoon(values.together.date),
      source:
        values.together.mode === TogetherMode.SINCE_BIRTH
          ? BeenWithSource.SINCE_BIRTH
          : BeenWithSource.JOINED_LATER,
    },
    weight: Number(values.weight.replace(",", ".")),
    weightUnit: values.weightUnit,
    isNeutered,
    notNeuteredReason:
      !isNeutered && values.notNeuteredReason
        ? toContractReason[values.notNeuteredReason]
        : undefined,
    microchipNumber: microchipNumber || undefined,
  } satisfies PutPetDetailsBody;
}
