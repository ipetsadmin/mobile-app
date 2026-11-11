import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { RadioMark } from '@/components/radio-mark';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type OptionCardProps = {
  label: string;
  icon?: ReactNode;
  selected: boolean;
  layout?: keyof typeof layouts;
  disabled?: boolean;
  onPress: () => void;
};

export function OptionCard({ label, icon, selected, layout = 'row', disabled = false, onPress }: OptionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        layouts[layout],
        {
          backgroundColor: selected ? theme.backgroundSelected : theme.backgroundField,
          borderColor: selected ? theme.primary : theme.border,
        },
        pressed && styles.pressed,
        disabled && !selected && styles.disabled,
      ]}>
      <RadioMark selected={selected} />
      {icon}
      <ThemedText type="button" style={styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  label: {
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});

const layouts = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
    paddingHorizontal: Spacing.lg,
  },
  compact: {
    flexGrow: 1,
    flexBasis: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minHeight: 56,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  tile: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 160,
    padding: Spacing.md,
  },
});
