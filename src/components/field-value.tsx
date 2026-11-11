import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { FieldControl } from '@/components/field-control';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const symbols = {
  chevron: {
    name: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
    size: 14,
  },
  calendar: {
    name: { ios: 'calendar', android: 'calendar_today', web: 'calendar_today' },
    size: 20,
  },
} as const;

type FieldValueProps = {
  label: string;
  text: string;
  symbol: keyof typeof symbols;
  isPlaceholder?: boolean;
  isFilled?: boolean;
  hasError?: boolean;
  onPress?: () => void;
};

export function FieldValue({
  label,
  text,
  symbol,
  isPlaceholder = false,
  isFilled = false,
  hasError = false,
  onPress,
}: FieldValueProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={label}
      accessibilityValue={{ text }}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <FieldControl isFilled={isFilled} hasError={hasError}>
        <ThemedText
          type="body"
          themeColor={isPlaceholder ? 'textSecondary' : 'text'}
          numberOfLines={1}
          style={styles.text}>
          {text}
        </ThemedText>
        <SymbolView {...symbols[symbol]} weight="semibold" tintColor={theme.text} />
      </FieldControl>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  text: {
    flex: 1,
  },
});
