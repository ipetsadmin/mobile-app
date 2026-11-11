import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { apiClient, getSessionCookie } from '@/lib/api-client';

import type { EditProfileValues } from '../schema/edit-profile.schema';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: EditProfileValues) =>
      apiClient.users.patchProfile(await getSessionCookie(), {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.account.all }),
  });
}
