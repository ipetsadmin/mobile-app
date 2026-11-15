import { zodResolver } from "@hookform/resolvers/zod"
import { type PetResponse, WeightUnit } from "@ipetsadmin/contracts"
import { useForm } from "react-hook-form"

import { toCompanionValues } from "../data/to-companion-values"
import {
  BirthDateMode,
  type CompanionValues,
  companionSchema,
  TogetherMode,
} from "../schema/companion.schema"

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
  })
}
