import { useMutation } from '@tanstack/react-query';

import { ApiError } from '@/lib/api-error';
import { authClient } from '@/lib/auth-client';

import type { SignInValues } from '../schema/sign-in.schema';

const EMAIL_NOT_VERIFIED_STATUS = 403;

export function useSignIn() {
  return useMutation({
    mutationFn: async (values: SignInValues) => {
      const { data, error } = await authClient.signIn.email({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) throw error;

      if (data.user.emailVerified === false) {
        await authClient.signOut();
        throw new ApiError(EMAIL_NOT_VERIFIED_STATUS, 'EMAIL_NOT_VERIFIED');
      }

      return data;
    },
  });
}
