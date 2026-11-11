import { router, Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useHeaderOptions } from '@/hooks/use-header-options';
import { useHasPets } from '@/features/pets';

export default function AppLayout() {
  const { t } = useTranslation();
  const { standard, largeTitle } = useHeaderOptions();
  const { hasPets, isResolved } = useHasPets();
  const hasCheckedPets = useRef(false);
  const profileHeader = { ...standard, headerShown: true };

  useEffect(() => {
    if (hasCheckedPets.current || !isResolved) return;
    hasCheckedPets.current = true;

    if (!hasPets) {
      router.push('/new-companion');
    }
  }, [hasPets, isResolved]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="new-companion"
        options={{ animation: 'slide_from_bottom', gestureEnabled: hasPets }}
      />
      <Stack.Screen
        name="edit-companion/[petId]"
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="health-card/[petId]"
        options={{ ...profileHeader, title: t('healthCard.title') }}
      />
      <Stack.Screen
        name="new-vaccine"
        options={{ ...profileHeader, title: t('vaccine.title') }}
      />
      <Stack.Screen
        name="new-treatment"
        options={{ ...profileHeader, title: t('treatment.title') }}
      />
      <Stack.Screen
        name="new-appointment"
        options={{ ...profileHeader, title: t('appointment.title') }}
      />
      <Stack.Screen
        name="notifications"
        options={{ ...largeTitle, headerShown: true, title: t('notifications.title') }}
      />
      <Stack.Screen
        name="profile/edit"
        options={{ ...profileHeader, title: t('account.profile.title') }}
      />
      <Stack.Screen
        name="profile/password"
        options={{ ...profileHeader, title: t('account.rows.password') }}
      />
      <Stack.Screen
        name="profile/household"
        options={{ ...profileHeader, title: t('account.rows.household') }}
      />
      <Stack.Screen
        name="profile/language"
        options={{ ...profileHeader, title: t('account.rows.language') }}
      />
      <Stack.Screen
        name="profile/notifications"
        options={{ ...profileHeader, title: t('account.rows.notifications') }}
      />
    </Stack>
  );
}
