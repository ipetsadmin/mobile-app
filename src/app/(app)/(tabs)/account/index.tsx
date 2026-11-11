import { router, type Href } from 'expo-router';

import { AccountScreen, type AccountSection } from '@/features/account';
import { useSignOutAction } from '@/features/auth';

const sectionRoutes: Record<AccountSection, Href> = {
  profile: '/profile/edit',
  password: '/profile/password',
  household: '/profile/household',
  language: '/profile/language',
  notifications: '/profile/notifications',
};

export default function AccountRoute() {
  const signOut = useSignOutAction();

  return (
    <AccountScreen
      onOpen={(section) => router.push(sectionRoutes[section])}
      onSignOut={signOut}
    />
  );
}
