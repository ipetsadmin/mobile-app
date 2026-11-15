import type { PetResponse } from "@ipetsadmin/contracts"
import type { ReactNode } from "react"

import { CompanionFormProvider } from "@/features/pets/components/companion-form-provider"

export function createCompanionFormWrapper(pet?: PetResponse) {
  return ({ children }: { children: ReactNode }) =>
    CompanionFormProvider({ pet, children })
}
