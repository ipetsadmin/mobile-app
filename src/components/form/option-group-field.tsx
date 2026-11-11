import type { ReactNode } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { OptionCard } from '@/components/option-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { FieldError } from './field-error';

const cardLayouts = {
  list: 'row',
  grid: 'tile',
  inline: 'compact',
} as const;

export type FieldOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type OptionGroupFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: FieldOption[];
  layout?: keyof typeof cardLayouts;
  disabled?: boolean;
  isLabelVisible?: boolean;
  onValueChange?: (value: string) => void;
};

export function OptionGroupField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  layout = 'list',
  disabled = false,
  isLabelVisible = false,
  onValueChange,
}: OptionGroupFieldProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <View style={styles.container}>
      {isLabelVisible && <ThemedText type="label">{`${label} ·`}</ThemedText>}
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
        style={layout === 'list' ? styles.list : styles.columns}>
        {options.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            icon={option.icon}
            layout={cardLayouts[layout]}
            disabled={disabled}
            selected={field.value === option.value}
            onPress={() => {
              field.onChange(option.value);
              onValueChange?.(option.value);
            }}
          />
        ))}
      </View>
      <FieldError errorKey={fieldState.error?.message} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  list: {
    gap: Spacing.md,
  },
  columns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});
