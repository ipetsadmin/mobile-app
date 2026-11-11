import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { useAuthSession } from '@/features/auth';
import { apiClient, getSessionCookie } from '@/lib/api-client';

import type { AppointmentValues } from '../schema/appointment.schema';
import { toCreateAppointmentBody } from './to-create-appointment-body';

export function useCreateAppointment(petId: string) {
  const { session } = useAuthSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: AppointmentValues) => {
      if (!session) throw new Error('Missing session');

      return apiClient.pets.createAppointment(
        await getSessionCookie(),
        petId,
        toCreateAppointmentBody(session.user.id, values),
      );
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.agenda.all }),
      ]),
  });
}
