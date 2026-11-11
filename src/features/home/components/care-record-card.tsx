import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CareRecordCardProps = {
  title: string;
  body: string;
  actionLabel: string;
  onPress: () => void;
};

export function CareRecordCard({ title, body, actionLabel, onPress }: CareRecordCardProps) {
  const theme = useTheme();
  const clear = `${theme.secondary}00`;
  const glows = [
    `radial-gradient(circle at 5% 130%, ${theme.secondary} 0%, ${clear} 28%)`,
    `radial-gradient(circle at 90% 135%, ${theme.secondary} 0%, ${clear} 30%)`,
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={actionLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundSelected, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { experimental_backgroundImage: glows.join(', ') }]}
      />
      <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
      <ThemedText type="subheading" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="bodySmall">{body}</ThemedText>
      <ThemedText type="bodySmall" themeColor="secondary" style={styles.action}>
        {`${actionLabel} →`}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing['2xs'],
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
  },
  title: {
    paddingRight: Spacing.md,
  },
  action: {
    marginTop: Spacing.xs,
    fontFamily: Fonts.bold,
  },
  pressed: {
    opacity: 0.8,
  },
});
