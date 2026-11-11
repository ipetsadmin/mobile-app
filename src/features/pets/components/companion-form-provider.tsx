import type { PetResponse } from "@ipetsadmin/contracts";
import type { PropsWithChildren } from "react";
import { FormProvider } from "react-hook-form";

import { useCompanionForm } from "../hooks/use-companion-form";

type CompanionFormProviderProps = PropsWithChildren<{
  pet?: PetResponse;
}>;

export function CompanionFormProvider({
  pet,
  children,
}: CompanionFormProviderProps) {
  const form = useCompanionForm(pet);

  return <FormProvider {...form}>{children}</FormProvider>;
}
