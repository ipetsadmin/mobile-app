import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/lib/auth-client';

export type SocialProvider = 'google' | 'apple';

export function useSocialSignIn() {
  return useMutation({
    mutationFn: async (provider: SocialProvider) => {
      const { error } = await authClient.signIn.social({ provider, callbackURL: '/' });

      if (error) throw error;
    },
  });
}
