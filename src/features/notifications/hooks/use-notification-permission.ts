import {
  AndroidImportance,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  type NotificationPermissionsStatus,
} from 'expo-notifications';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export type NotificationPermission = 'granted' | 'denied' | 'undetermined';

const DEFAULT_CHANNEL_ID = 'default';

function toPermission(status: NotificationPermissionsStatus): NotificationPermission {
  if (status.granted) return 'granted';

  return status.canAskAgain ? 'undetermined' : 'denied';
}

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('undetermined');

  useEffect(() => {
    const refresh = () =>
      getPermissionsAsync()
        .then((status) => setPermission(toPermission(status)))
        .catch(() => {});

    refresh();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });

    return () => subscription.remove();
  }, []);

  const request = async () => {
    if (process.env.EXPO_OS === 'android') {
      await setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
        name: DEFAULT_CHANNEL_ID,
        importance: AndroidImportance.DEFAULT,
      });
    }

    const next = toPermission(await requestPermissionsAsync());

    setPermission(next);

    return next;
  };

  return { permission, request };
}
