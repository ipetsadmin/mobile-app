import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

import { TextButton } from '@/components/text-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { SettingsGroup } from '../components/settings-group';
import { SettingsSwitchRow } from '../components/settings-switch-row';
import { useNotificationPreferences } from '../hooks/use-notification-preferences';

export function NotificationPreferencesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isPushOn, isEmailOn, isPermissionDenied, setPush, setEmail, openSettings } =
    useNotificationPreferences();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}>
      <SettingsGroup label={t('account.notificationPreferences.channels')}>
        <SettingsSwitchRow
          label={t('account.notificationPreferences.push')}
          description={t('account.notificationPreferences.pushHint')}
          value={isPushOn}
          onValueChange={setPush}
        />
        <SettingsSwitchRow
          label={t('account.notificationPreferences.email')}
          description={t('account.notificationPreferences.emailHint')}
          value={isEmailOn}
          isLast
          onValueChange={setEmail}
        />
      </SettingsGroup>
      {isPermissionDenied && (
        <>
          <ThemedText type="bodySmall" themeColor="textSecondary">
            {t('account.notificationPreferences.denied')}
          </ThemedText>
          <TextButton
            variant="strong"
            title={t('account.notificationPreferences.openSettings')}
            onPress={openSettings}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.lg,
    padding: Spacing.lg,
  },
});
