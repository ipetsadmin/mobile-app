import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { SegmentedControl } from '@/components/segmented-control';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/use-theme';

export function AppearanceSetting() {
  const { t } = useTranslation();
  const { themeName, setPreference } = useThemePreference();

  return (
    <View style={styles.setting}>
      <ThemedText type="label">{`${t('account.appearance.label')} ·`}</ThemedText>
      <SegmentedControl
        label={t('account.appearance.label')}
        value={themeName}
        onChange={setPreference}
        options={[
          { value: 'light', label: t('account.appearance.light') },
          { value: 'dark', label: t('account.appearance.dark') },
          { value: 'exploratory', label: t('account.appearance.exploratory') },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  setting: {
    gap: Spacing.xs,
  },
});
