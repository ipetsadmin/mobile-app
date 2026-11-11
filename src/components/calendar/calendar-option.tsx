import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CalendarOptionProps = {
  label: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};

export function CalendarOption({ label, selected, disabled, onPress }: CalendarOptionProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected && { backgroundColor: theme.primary },
        (pressed || disabled) && styles.dimmed,
      ]}>
      <ThemedText
        type={selected ? 'bodyStrong' : 'body'}
        style={[styles.label, selected && { color: theme.onPrimary }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexBasis: '30%',
    flexGrow: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.pill,
  },
  label: {
    textTransform: 'capitalize',
  },
  dimmed: {
    opacity: 0.3,
  },
});
