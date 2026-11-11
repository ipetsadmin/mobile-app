import { zodResolver } from "@hookform/resolvers/zod";
import { WeightUnit, type PetResponse } from "@ipetsadmin/contracts";
import { useForm } from "react-hook-form";

import { toCompanionValues } from "../data/to-companion-values";
import {
  BirthDateMode,
  companionSchema,
  TogetherMode,
  type CompanionValues,
} from "../schema/companion.schema";

export function useCompanionForm(pet?: PetResponse) {
  return useForm<CompanionValues>({
    resolver: zodResolver(companionSchema),
    defaultValues: pet
      ? toCompanionValues(pet)
      : {
          name: "",
          birth: { mode: BirthDateMode.EXACT, date: new Date() },
          together: { mode: TogetherMode.SINCE_BIRTH, date: new Date() },
          weight: "",
          weightUnit: WeightUnit.KG,
          isNeutered: false,
          microchipNumber: "",
        },
  });
}
