import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { useAuthSession } from '@/features/auth';
import { apiClient, getSessionCookie } from '@/lib/api-client';

import type { TreatmentValues } from '../schema/treatment.schema';
import { toCreateTreatmentBody } from './to-create-treatment-body';

export function useCreateTreatment(petId: string) {
  const { session } = useAuthSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: TreatmentValues) => {
      if (!session) throw new Error('Missing session');

      return apiClient.pets.createTreatment(
        await getSessionCookie(),
        petId,
        toCreateTreatmentBody(session.user.id, values),
      );
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.treatments.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(petId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.agenda.all }),
      ]),
  });
}
