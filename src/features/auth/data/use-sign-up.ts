import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/lib/auth-client';

import type { SignUpValues } from '../schema/sign-up.schema';

export function useSignUp() {
  return useMutation({
    mutationFn: async (values: SignUpValues) => {
      const { data, error } = await authClient.signUp.email({
        email: values.email.trim(),
        password: values.password,
        name: `${values.firstName.trim()} ${values.lastName.trim()}`,
        callbackURL: '/',
      });

      if (error) throw error;

      return data;
    },
  });
}
