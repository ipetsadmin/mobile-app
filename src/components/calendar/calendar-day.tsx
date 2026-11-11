import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CalendarDayProps = {
  day: number;
  accessibilityLabel: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};

export function CalendarDay({
  day,
  accessibilityLabel,
  selected,
  disabled,
  onPress,
}: CalendarDayProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.cell, pressed && styles.pressed]}>
      <View style={[styles.mark, selected && { backgroundColor: theme.primary }]}>
        <ThemedText
          type={selected ? 'bodyStrong' : 'body'}
          style={[selected && { color: theme.onPrimary }, disabled && styles.disabled]}>
          {day}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: `${100 / 7}%`,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
});
