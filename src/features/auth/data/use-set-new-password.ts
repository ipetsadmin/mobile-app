import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/lib/auth-client';

type SetNewPasswordArgs = {
  token: string;
  newPassword: string;
};

export function useSetNewPassword() {
  return useMutation({
    mutationFn: async ({ token, newPassword }: SetNewPasswordArgs) => {
      const { error } = await authClient.resetPassword({ token, newPassword });

      if (error) throw error;
    },
  });
}
