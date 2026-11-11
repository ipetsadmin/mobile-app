import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type SegmentOption<T extends string = string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  label: string;
  options: SegmentOption<T>[];
  value?: T;
  style?: StyleProp<ViewStyle>;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  style,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={[
        styles.track,
        { backgroundColor: theme.backgroundSelected, borderColor: theme.border },
        style,
      ]}>
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              selected && { backgroundColor: theme.backgroundField },
              pressed && styles.pressed,
            ]}>
            <ThemedText type={selected ? 'bodyStrong' : 'body'}>{option.label}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    minHeight: 56,
    padding: Spacing['2xs'],
    borderWidth: 1,
    borderRadius: Radius.control,
    borderCurve: 'continuous',
  },
  segment: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.control - Spacing['2xs'],
    borderCurve: 'continuous',
  },
  pressed: {
    opacity: 0.7,
  },
});
