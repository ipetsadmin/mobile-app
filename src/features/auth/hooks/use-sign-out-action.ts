import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { toast } from 'sonner-native';

import { useSignOut } from '../data/use-sign-out';

export function useSignOutAction() {
  const { t } = useTranslation();
  const { mutate } = useSignOut();

  const signOut = () => mutate(undefined, { onError: () => toast.error(t('account.signOutError')) });

  return () =>
    Alert.alert(t('account.signOutConfirm.title'), t('account.signOutConfirm.message'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('account.signOut'), style: 'destructive', onPress: signOut },
    ]);
}
