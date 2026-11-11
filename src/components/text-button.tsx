import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { ThemeColor, TypographyVariant } from '@/constants/theme';

type TextButtonVariant = 'subtle' | 'plain' | 'strong';

type TextButtonProps = {
  title: string;
  variant?: TextButtonVariant;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

const variantText: Record<TextButtonVariant, { type: TypographyVariant; color: ThemeColor }> = {
  subtle: { type: 'bodySmall', color: 'textSecondary' },
  plain: { type: 'body', color: 'text' },
  strong: { type: 'bodyStrong', color: 'text' },
};

export function TextButton({ title, variant = 'subtle', style, onPress }: TextButtonProps) {
  const text = variantText[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      hitSlop={12}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed, style]}>
      <ThemedText type={text.type} themeColor={text.color}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
});
