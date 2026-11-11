import { useState, type ReactNode } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { FieldControl } from '@/components/field-control';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { FieldShell } from './field-shell';

export type TextFieldProps<T extends FieldValues> = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'style'
> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  labelHint?: string;
  hint?: string;
  trailing?: ReactNode;
  accessory?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  labelHint,
  hint,
  trailing,
  accessory,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps<T>) {
  const theme = useTheme();
  const { field, fieldState } = useController({ control, name });
  const { ref, value, onChange, onBlur: onFieldBlur } = field;
  const [isFocused, setIsFocused] = useState(false);
  const errorKey = fieldState.error?.message;

  return (
    <FieldShell label={label} labelHint={labelHint} hint={hint} errorKey={errorKey} style={style}>
      <View style={styles.controlRow}>
        <FieldControl isFocused={isFocused} hasError={!!errorKey} style={styles.control}>
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChange}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onFieldBlur();
              onBlur?.(event);
            }}
            accessibilityLabel={label}
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            {...inputProps}
          />
          {trailing}
        </FieldControl>
        {accessory}
      </View>
    </FieldShell>
  );
}

const styles = StyleSheet.create({
  controlRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.sm,
  },
  control: {
    flex: 1,
  },
  input: {
    ...Typography.body,
    flex: 1,
    paddingVertical: Spacing.sm,
  },
});
