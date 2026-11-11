import { StyleSheet, View } from 'react-native';

import { ThemedSwitch } from '@/components/themed-switch';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SettingsSwitchRowProps = {
  label: string;
  description?: string;
  value: boolean;
  isLast?: boolean;
  onValueChange: (value: boolean) => void;
};

export function SettingsSwitchRow({
  label,
  description,
  value,
  isLast = false,
  onValueChange,
}: SettingsSwitchRowProps) {
  const theme = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }, isLast && styles.last]}>
      <View style={styles.texts}>
        <ThemedText type="body">{label}</ThemedText>
        {description && (
          <ThemedText type="bodySmall" themeColor="textSecondary">
            {description}
          </ThemedText>
        )}
      </View>
      <ThemedSwitch label={label} value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 52,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  last: {
    borderBottomWidth: 0,
  },
  texts: {
    flex: 1,
    gap: Spacing['2xs'],
  },
});
