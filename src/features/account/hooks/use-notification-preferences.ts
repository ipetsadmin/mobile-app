import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { toast } from 'sonner-native';

import {
  useNotificationPermission,
  useUpdateNotificationPreferences,
  type NotificationPreferences,
} from '@/features/notifications';

import { useAccount } from '../data/use-account';

export function useNotificationPreferences() {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { permission, request } = useNotificationPermission();
  const { mutate, isPending, variables } = useUpdateNotificationPreferences();

  const pending = isPending ? variables : undefined;
  const currentPush = pending?.push ?? account.notifications.push;
  const currentEmail = pending?.email ?? account.notifications.email;

  const save = (changes: Partial<NotificationPreferences>) =>
    mutate(
      { push: currentPush, email: currentEmail, ...changes },
      { onError: () => toast.error(t('account.notificationPreferences.error')) },
    );

  const setPush = async (isEnabled: boolean) => {
    if (!isEnabled) {
      save({ push: false });
      return;
    }

    const result = permission === 'granted' ? permission : await request();

    if (result !== 'granted') {
      toast.error(t('account.notificationPreferences.denied'));
      return;
    }

    save({ push: true });
  };

  return {
    isPushOn: currentPush && permission === 'granted',
    isEmailOn: currentEmail,
    isPermissionDenied: permission === 'denied',
    setPush,
    setEmail: (isEnabled: boolean) => save({ email: isEnabled }),
    openSettings: () => Linking.openSettings(),
  };
}
