import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type OrDividerProps = {
  label: string;
};

export function OrDivider({ label }: OrDividerProps) {
  const theme = useTheme();
  const lineStyle = [styles.line, { backgroundColor: theme.border }];

  return (
    <View style={styles.container}>
      <View style={lineStyle} />
      <ThemedText type="label" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={lineStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
});
