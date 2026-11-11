import { skipToken, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { useAuthSession } from '@/features/auth';
import { apiClient, getSessionCookie } from '@/lib/api-client';

import { sortAgendaItems } from '../utils/sort-agenda-items';

export function useAgenda(days?: number) {
  const { session } = useAuthSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: queryKeys.agenda.list(userId, days),
    queryFn: userId
      ? async () => apiClient.users.getAgenda(await getSessionCookie(), days)
      : skipToken,
    select: (response) => sortAgendaItems(response.data?.items ?? []),
  });
}
