import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) =>
      apiClient.auth.sendVerificationOtp(process.env.EXPO_PUBLIC_API_URL ?? '', email),
  });
}
