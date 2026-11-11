import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/lib/auth-client';

import type { ChangePasswordValues } from '../schema/change-password.schema';

export function useChangePassword() {
  return useMutation({
    mutationFn: async (values: ChangePasswordValues) => {
      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });

      if (error) throw error;
    },
  });
}
