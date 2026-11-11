import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { apiClient, getSessionCookie } from "@/lib/api-client";

import { parsePet } from "../utils/parse-pet";

export function usePet(petId: string) {
  return useQuery({
    queryKey: queryKeys.pets.detail(petId),
    queryFn: async () => {
      const response = await apiClient.pets.getById(
        await getSessionCookie(),
        petId,
      );

      if (!response.data) throw new Error("Missing pet");

      return response.data;
    },
    select: parsePet,
  });
}
