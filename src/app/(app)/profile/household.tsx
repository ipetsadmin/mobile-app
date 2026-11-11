import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function HouseholdRoute() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('account.rows.household')}
      actions={[{ label: t('common.back'), variant: 'secondary', onPress: () => router.back() }]}
    />
  );
}
