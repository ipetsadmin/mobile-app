import type { PetResponse } from "@ipetsadmin/contracts"
import type { ReactElement } from "react"

import { CompanionFormProvider } from "@/features/pets/components/companion-form-provider"

import { renderWithProviders } from "./render-with-providers"

export function renderInCompanionForm(ui: ReactElement, pet?: PetResponse) {
  return renderWithProviders(
    <CompanionFormProvider pet={pet}>{ui}</CompanionFormProvider>,
  )
}
