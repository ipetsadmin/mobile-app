import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { apiClient, getSessionCookie } from '@/lib/api-client';

export function usePetAppointments(petId: string) {
  return useQuery({
    queryKey: queryKeys.appointments.list(petId),
    queryFn: async () => apiClient.pets.getAppointments(await getSessionCookie(), petId),
    select: (response) => response.data ?? [],
  });
}
