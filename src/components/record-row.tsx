import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type RecordRowProps = {
  title: string;
  subtitle?: string;
  caption?: string;
  isMuted?: boolean;
};

export function RecordRow({ title, subtitle, caption, isMuted = false }: RecordRowProps) {
  const theme = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }, isMuted && styles.muted]}>
      <ThemedText type="bodyStrong">{title}</ThemedText>
      {subtitle && <ThemedText type="bodySmall">{subtitle}</ThemedText>}
      {caption && (
        <ThemedText type="bodySmall" themeColor="textSecondary">
          {caption}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing['2xs'],
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  muted: {
    opacity: 0.6,
  },
});
