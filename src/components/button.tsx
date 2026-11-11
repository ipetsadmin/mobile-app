import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'md' | 'lg';

type ButtonProps = {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

type VariantColors = { background?: ThemeColor; border?: ThemeColor; content: ThemeColor };

const variantColors: Record<ButtonVariant, VariantColors> = {
  primary: { background: 'primary', content: 'onPrimary' },
  secondary: { background: 'backgroundElement', content: 'text' },
  outline: { border: 'border', content: 'text' },
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  style,
  onPress,
}: ButtonProps) {
  const theme = useTheme();
  const colors = variantColors[variant];
  const isInactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        sizes[size],
        colors.background && { backgroundColor: theme[colors.background] },
        colors.border && { borderWidth: 1, borderColor: theme[colors.border] },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {loading ? <ActivityIndicator color={theme[colors.content]} /> : icon}
      {!loading && (
        <ThemedText type="button" themeColor={colors.content}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.control,
    borderCurve: 'continuous',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});

const sizes = StyleSheet.create({
  md: {
    minHeight: 48,
    paddingHorizontal: Spacing.md,
  },
  lg: {
    minHeight: 56,
    paddingHorizontal: Spacing.lg,
  },
});
