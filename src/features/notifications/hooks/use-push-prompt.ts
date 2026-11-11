import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { toast } from 'sonner-native';

import { hasAnsweredPushPrompt, markPushPromptAnswered } from '@/lib/push-prompt-storage';

import { useUpdateNotificationPreferences } from '../data/use-update-notification-preferences';
import { useNotificationPermission } from './use-notification-permission';

type UsePushPromptArgs = {
  isEnabled: boolean;
  isEmailOn: boolean;
};

export function usePushPrompt({ isEnabled, isEmailOn }: UsePushPromptArgs) {
  const { t } = useTranslation();
  const { permission, request } = useNotificationPermission();
  const { mutate } = useUpdateNotificationPreferences();
  const hasPrompted = useRef(false);

  useEffect(() => {
    if (!isEnabled || permission !== 'undetermined' || hasPrompted.current) return;

    hasPrompted.current = true;

    const allow = async () => {
      await markPushPromptAnswered();

      if ((await request()) === 'granted') {
        mutate({ push: true, email: isEmailOn }, { onError: () => toast.error(t('notifications.pushPrompt.error')) });
      }
    };

    hasAnsweredPushPrompt()
      .then((hasAnswered) => {
        if (hasAnswered) return;

        Alert.alert(t('notifications.pushPrompt.title'), t('notifications.pushPrompt.message'), [
          {
            text: t('notifications.pushPrompt.later'),
            style: 'cancel',
            onPress: markPushPromptAnswered,
          },
          { text: t('notifications.pushPrompt.allow'), onPress: allow },
        ]);
      })
      .catch(() => {});
  }, [isEnabled, isEmailOn, permission, request, mutate, t]);
}
