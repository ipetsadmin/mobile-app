import { skipToken, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { useAuthSession } from "@/features/auth";
import { apiClient, getSessionCookie } from "@/lib/api-client";

import { parsePet } from "../utils/parse-pet";

export function usePets() {
  const { session } = useAuthSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: queryKeys.pets.list(userId),
    queryFn: userId
      ? async () => {
          const response = await apiClient.users.getPets(await getSessionCookie(), userId);

          if (!response.data) throw new Error('Missing pets');

          return response.data;
        }
      : skipToken,
    select: (pets) => pets.map(parsePet),
  });
}
