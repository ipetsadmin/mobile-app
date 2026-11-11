import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { FieldError } from './field-error';

type FieldShellProps = PropsWithChildren<{
  label: string;
  labelHint?: string;
  hint?: string;
  errorKey?: string;
  style?: StyleProp<ViewStyle>;
}>;

export function FieldShell({ label, labelHint, hint, errorKey, style, children }: FieldShellProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <ThemedText type="label">{`${label} ·`}</ThemedText>
        {labelHint && <ThemedText type="bodySmall">{labelHint}</ThemedText>}
      </View>
      {children}
      <FieldError errorKey={errorKey} />
      {!errorKey && hint && <ThemedText type="bodySmall">{hint}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
});
