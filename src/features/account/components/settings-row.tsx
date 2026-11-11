import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SettingsRowProps = {
  label: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
};

export function SettingsRow({ label, value, isLast = false, onPress }: SettingsRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      disabled={!onPress}
      accessibilityLabel={label}
      accessibilityValue={value ? { text: value } : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: theme.border },
        isLast && styles.last,
        pressed && styles.pressed,
      ]}>
      <ThemedText type="body" style={styles.label}>
        {label}
      </ThemedText>
      {value && (
        <ThemedText type="body" numberOfLines={1} style={styles.value}>
          {value}
        </ThemedText>
      )}
      {onPress && (
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={12}
          weight="semibold"
          tintColor={theme.textSecondary}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 52,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  last: {
    borderBottomWidth: 0,
  },
  label: {
    flexGrow: 1,
    flexShrink: 0,
  },
  value: {
    flexShrink: 1,
    textAlign: 'right',
  },
  pressed: {
    opacity: 0.6,
  },
});
