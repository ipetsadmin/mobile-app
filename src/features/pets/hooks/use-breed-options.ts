import { CatBreed, DogBreed, Species } from "@ipetsadmin/contracts";
import { useFormContext, useWatch } from "react-hook-form";

import type { SelectOption } from "@/components/select-sheet";

import type { CompanionValues } from "../schema/companion.schema";

const breedsBySpecies: Record<Species, string[]> = {
  [Species.DOG]: Object.values(DogBreed),
  [Species.CAT]: Object.values(CatBreed),
};

export function useBreedOptions(): SelectOption[] {
  const { control } = useFormContext<CompanionValues>();
  const species = useWatch({ control, name: "species" });
  const breeds = species ? breedsBySpecies[species] : [];

  return breeds.map((breed) => ({ value: breed, label: breed }));
}
