import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const symbols = {
  previous: { ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' },
  next: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
} as const;

type CalendarArrowProps = {
  direction: keyof typeof symbols;
  label: string;
  disabled: boolean;
  onPress: () => void;
};

export function CalendarArrow({ direction, label, disabled, onPress }: CalendarArrowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={Spacing.xs}
      onPress={onPress}
      style={({ pressed }) => [styles.arrow, (pressed || disabled) && styles.dimmed]}>
      <SymbolView name={symbols[direction]} size={14} weight="semibold" tintColor={theme.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arrow: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmed: {
    opacity: 0.3,
  },
});
