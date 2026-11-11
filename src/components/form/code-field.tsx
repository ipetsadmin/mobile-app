import { useState } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CodeFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  length?: number;
  autoFocus?: boolean;
};

export function CodeField<T extends FieldValues>({
  control,
  name,
  label,
  length = 6,
  autoFocus = false,
}: CodeFieldProps<T>) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const { field } = useController({ control, name });
  const { ref, value, onChange, onBlur } = field;
  const code = String(value ?? '');
  const activeIndex = Math.min(code.length, length - 1);

  return (
    <View style={styles.container}>
      {Array.from({ length }, (_, index) => {
        const isActive = isFocused && index === activeIndex;

        return (
          <View
            key={index}
            style={[
              styles.cell,
              {
                backgroundColor: theme.backgroundField,
                borderColor: isActive ? theme.secondary : theme.border,
              },
              isActive && styles.activeCell,
            ]}>
            <ThemedText type="heading">{code[index] ?? ''}</ThemedText>
          </View>
        );
      })}
      <TextInput
        ref={ref}
        value={code}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        accessibilityLabel={label}
        autoFocus={autoFocus}
        caretHidden
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  cell: {
    flex: 1,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Radius.control,
    borderCurve: 'continuous',
  },
  activeCell: {
    borderWidth: 1.5,
  },
  input: {
    ...StyleSheet.absoluteFill,
    color: 'transparent',
  },
});
