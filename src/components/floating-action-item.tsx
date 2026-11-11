import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOut, ReduceMotion } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type FloatingAction = {
  key: string;
  label: string;
  icon: SymbolViewProps['name'];
  onPress: () => void;
};

type FloatingActionItemProps = {
  action: FloatingAction;
  delay: number;
  onPress: () => void;
};

export function FloatingActionItem({ action, delay, onPress }: FloatingActionItemProps) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(Motion.fast).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(100).reduceMotion(ReduceMotion.System)}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={action.label}
        onPress={onPress}
        style={({ pressed }) => [
          styles.action,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && styles.pressed,
        ]}
      >
        <ThemedText type="button">{action.label}</ThemedText>
        <SymbolView name={action.icon} size={20} weight="medium" tintColor={theme.text} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  pressed: {
    opacity: 0.7,
  },
});
