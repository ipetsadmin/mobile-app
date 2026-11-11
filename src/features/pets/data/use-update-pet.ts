import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { apiClient, getSessionCookie } from "@/lib/api-client";

import type { CompanionValues } from "../schema/companion.schema";
import { toPetDetailsBody } from "./to-pet-details-body";

type UpdatePetArgs = {
  petId: string;
  values: CompanionValues;
};

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, values }: UpdatePetArgs) =>
      apiClient.pets.update(
        await getSessionCookie(),
        petId,
        toPetDetailsBody(values),
      ),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.pets.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.agenda.all }),
      ]),
  });
}
