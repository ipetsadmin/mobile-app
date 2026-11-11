import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { apiClient, getSessionCookie } from '@/lib/api-client';

export type NotificationPreferences = {
  push: boolean;
  email: boolean;
};

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: NotificationPreferences) =>
      apiClient.users.patchPreferences(await getSessionCookie(), { notifications: preferences }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.account.all }),
  });
}
