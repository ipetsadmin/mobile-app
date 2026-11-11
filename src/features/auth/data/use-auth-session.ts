import { authClient } from '@/lib/auth-client';

export function useAuthSession() {
  const { data, isPending } = authClient.useSession();

  return { session: data, isPending };
}
