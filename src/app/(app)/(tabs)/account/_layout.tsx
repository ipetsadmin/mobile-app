import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useHeaderOptions } from '@/hooks/use-header-options';

export default function AccountTabLayout() {
  const { t } = useTranslation();
  const { largeTitle } = useHeaderOptions();

  return (
    <Stack screenOptions={largeTitle}>
      <Stack.Screen name="index" options={{ title: t('account.title') }} />
    </Stack>
  );
}
