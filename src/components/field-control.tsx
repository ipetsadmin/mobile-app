import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FieldControlProps = PropsWithChildren<{
  isFocused?: boolean;
  isFilled?: boolean;
  hasError?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function FieldControl({
  isFocused = false,
  isFilled = false,
  hasError = false,
  style,
  children,
}: FieldControlProps) {
  const theme = useTheme();
  const borderColors = [
    isFocused && theme.secondary,
    isFilled && theme.primary,
    hasError && theme.accent,
    theme.border,
  ];

  return (
    <View
      style={[
        styles.control,
        {
          backgroundColor: isFilled ? theme.backgroundSelected : theme.backgroundField,
          borderColor: borderColors.find((color) => color !== false),
        },
        isFocused && styles.focused,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minHeight: 56,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.control,
    borderCurve: 'continuous',
  },
  focused: {
    borderWidth: 1.5,
  },
});
