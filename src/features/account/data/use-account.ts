import { skipToken, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { useAuthSession } from '@/features/auth';
import { apiClient, getSessionCookie } from '@/lib/api-client';

export function useAccount() {
  const { session } = useAuthSession();
  const userId = session?.user.id;
  const { data: profile, ...query } = useQuery({
    queryKey: queryKeys.account.profile(userId),
    queryFn: userId
      ? async () => apiClient.users.getProfile(await getSessionCookie())
      : skipToken,
    select: (response) => response.data,
  });

  const firstName = profile?.profile?.firstName ?? '';
  const lastName = profile?.profile?.lastName ?? '';

  return {
    ...query,
    account: {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim() || (session?.user.name ?? ''),
      email: session?.user.email ?? '',
      photoUri: profile?.profile?.avatar ?? undefined,
      notifications: {
        push: profile?.preferences?.notifications?.push ?? false,
        email: profile?.preferences?.notifications?.email ?? true,
      },
    },
  };
}
