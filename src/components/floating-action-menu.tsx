import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';

import { Motion, Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { FloatingActionItem, type FloatingAction } from './floating-action-item';

export type { FloatingAction };

type FloatingActionMenuProps = {
  label: string;
  actions: FloatingAction[];
};

const BUTTON_SIZE = 56;
const STAGGER = 40;
const FALLBACK_BACKGROUND = '#FFFFFF';
const FALLBACK_ICON = '#1A1A1A';
const hasGlass = isLiquidGlassAvailable();

export function FloatingActionMenu({ label, actions }: FloatingActionMenuProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);

  const plus = (
    <Animated.View
      style={{
        transitionProperty: 'transform',
        transitionDuration: Motion.fast,
        transform: [{ rotate: isOpen ? '45deg' : '0deg' }],
      }}
    >
      <SymbolView
        name={{ ios: 'plus', android: 'add', web: 'add' }}
        size={26}
        weight="semibold"
        tintColor={hasGlass ? theme.text : FALLBACK_ICON}
      />
    </Animated.View>
  );

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(Motion.fast).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(Motion.fast).reduceMotion(ReduceMotion.System)}
          style={StyleSheet.absoluteFill}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() => setIsOpen(false)}
            style={[StyleSheet.absoluteFill, styles.backdrop, { backgroundColor: theme.background }]}
          />
        </Animated.View>
      )}
      <View
        pointerEvents="box-none"
        style={[styles.stack, { bottom: insets.bottom + Spacing.md }]}
      >
        {isOpen &&
          actions.map((action, index) => (
            <FloatingActionItem
              key={action.key}
              action={action}
              delay={(actions.length - 1 - index) * STAGGER}
              onPress={() => {
                setIsOpen(false);
                action.onPress();
              }}
            />
          ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ expanded: isOpen }}
          onPress={() => setIsOpen((current) => !current)}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          {hasGlass ? (
            <GlassView glassEffectStyle="regular" isInteractive style={styles.surface}>
              {plus}
            </GlassView>
          ) : (
            <View style={[styles.surface, styles.fallback]}>{plus}</View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    opacity: 0.92,
  },
  stack: {
    position: 'absolute',
    right: Spacing.lg,
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  surface: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  fallback: {
    backgroundColor: FALLBACK_BACKGROUND,
    boxShadow: Shadows.raised,
  },
  pressed: {
    opacity: 0.7,
  },
});
