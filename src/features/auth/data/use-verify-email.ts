import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

type VerifyEmailArgs = {
  email: string;
  otp: string;
};

export function useVerifyEmail() {
  return useMutation({
    mutationFn: ({ email, otp }: VerifyEmailArgs) =>
      apiClient.auth.verifyEmail(process.env.EXPO_PUBLIC_API_URL ?? '', { email, otp }),
  });
}
