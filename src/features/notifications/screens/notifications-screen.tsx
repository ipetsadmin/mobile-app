import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet } from 'react-native';

import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { queryKeys } from '@/constants/query-keys';
import { Spacing } from '@/constants/theme';
import { usePullRefresh } from '@/hooks/use-pull-refresh';
import { useTheme } from '@/hooks/use-theme';

import { NotificationRow } from '../components/notification-row';
import { useNotifications } from '../data/use-notifications';

export function NotificationsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { notifications, isPending, isError, refetch } = useNotifications();
  const { isRefreshing, onRefresh } = usePullRefresh([queryKeys.agenda.all]);

  return (
    <FlatList
      data={notifications}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      keyExtractor={(notification) => notification.id}
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => <NotificationRow notification={item} />}
      ListEmptyComponent={
        isPending || isError ? (
          <StatusMessage
            message={isError ? t('common.loadError') : undefined}
            actionLabel={isError ? t('common.retry') : undefined}
            onAction={refetch}
          />
        ) : (
          <ThemedText type="body" themeColor="textSecondary" style={styles.empty}>
            {t('notifications.empty')}
          </ThemedText>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  empty: {
    paddingVertical: Spacing.xl,
    textAlign: 'center',
  },
});
