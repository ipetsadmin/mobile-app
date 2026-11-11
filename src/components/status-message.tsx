import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type StatusMessageProps = {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function StatusMessage({ message, actionLabel, onAction }: StatusMessageProps) {
  return (
    <View style={styles.container}>
      {message ? (
        <ThemedText type="body" themeColor="textSecondary" style={styles.text}>
          {message}
        </ThemedText>
      ) : (
        <ActivityIndicator />
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xl,
  },
  text: {
    textAlign: 'center',
  },
});
