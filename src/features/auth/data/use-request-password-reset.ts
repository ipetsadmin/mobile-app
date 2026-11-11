import { useMutation } from '@tanstack/react-query';
import { createURL } from 'expo-linking';

import { authClient } from '@/lib/auth-client';

import type { ResetPasswordValues } from '../schema/reset-password.schema';

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (values: ResetPasswordValues) => {
      const { error } = await authClient.requestPasswordReset({
        email: values.email.trim(),
        redirectTo: createURL('/new-password'),
      });

      if (error) throw error;
    },
  });
}
