import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { AppNotification } from '../data/use-notifications';

const DOT_SIZE = 10;

type NotificationRowProps = {
  notification: AppNotification;
};

export function NotificationRow({ notification }: NotificationRowProps) {
  const theme = useTheme();
  const dotColor = notification.isUrgent ? theme.accent : theme.primary;

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={styles.texts}>
        <ThemedText type="bodyStrong">
          {notification.title}
        </ThemedText>
        <ThemedText type="bodySmall">{notification.detail}</ThemedText>
      </View>
      <ThemedText type="bodySmall">{notification.timeLabel}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    marginTop: (Typography.body.lineHeight - DOT_SIZE) / 2,
    borderRadius: Radius.pill,
  },
  texts: {
    flex: 1,
    gap: Spacing['2xs'],
  },
});
