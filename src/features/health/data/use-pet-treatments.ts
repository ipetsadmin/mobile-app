import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { apiClient, getSessionCookie } from '@/lib/api-client';

export function usePetTreatments(petId: string) {
  return useQuery({
    queryKey: queryKeys.treatments.list(petId),
    queryFn: async () => apiClient.pets.getTreatments(await getSessionCookie(), petId),
    select: (response) => response.data ?? [],
  });
}
