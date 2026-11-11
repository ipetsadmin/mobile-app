import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { useAuthSession } from "@/features/auth";
import { apiClient, getSessionCookie } from "@/lib/api-client";

import type { CompanionValues } from "../schema/companion.schema";
import { toCreatePetBody } from "./to-create-pet-body";

export function useCreatePet() {
  const { session } = useAuthSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CompanionValues) => {
      if (!session) throw new Error("Missing session");

      const response = await apiClient.users.createPet(
        await getSessionCookie(),
        session.user.id,
        toCreatePetBody(values),
      );

      if (!response.data) throw new Error("Missing created pet");

      return response.data;
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.pets.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.agenda.all }),
      ]),
  });
}
