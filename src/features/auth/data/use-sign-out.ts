import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authClient } from '@/lib/auth-client';

import { clearPendingCredentials } from '../utils/pending-credentials';

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();

      if (error) throw error;
    },
    onSuccess: () => {
      clearPendingCredentials();
      queryClient.clear();
    },
  });
}
