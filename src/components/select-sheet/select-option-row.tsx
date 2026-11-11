import { Pressable, StyleSheet } from 'react-native';

import { RadioMark } from '@/components/radio-mark';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SelectOptionRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectOptionRow({ label, selected, onPress }: SelectOptionRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <ThemedText type={selected ? 'button' : 'body'} style={styles.label}>
        {label}
      </ThemedText>
      <RadioMark selected={selected} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    flex: 1,
  },
});
