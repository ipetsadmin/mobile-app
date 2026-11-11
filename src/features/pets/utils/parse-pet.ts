import type { PetResponse } from "@ipetsadmin/contracts";

export function parsePet(pet: PetResponse): PetResponse {
  return {
    ...pet,
    birthDate: { ...pet.birthDate, date: new Date(pet.birthDate.date) },
    beenWithUsSince: {
      ...pet.beenWithUsSince,
      date: new Date(pet.beenWithUsSince.date),
    },
  };
}
