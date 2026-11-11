import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SettingsGroupProps = PropsWithChildren<{
  label: string;
}>;

export function SettingsGroup({ label, children }: SettingsGroupProps) {
  const theme = useTheme();

  return (
    <View style={styles.group}>
      <ThemedText type="label">{`${label} ·`}</ThemedText>
      <View
        style={[
          styles.rows,
          { backgroundColor: theme.backgroundSelected, borderColor: theme.border },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: Spacing.xs,
  },
  rows: {
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
});
