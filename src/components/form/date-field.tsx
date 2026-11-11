import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Calendar } from '@/components/calendar';
import { FieldValue } from '@/components/field-value';
import { Spacing } from '@/constants/theme';
import { formatLongDate } from '@/utils/format-date';
import { toTimeValue, withTime } from '@/utils/time-slots';

import { FieldShell } from './field-shell';

type DateFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  minimumDate?: Date;
  maximumDate?: Date;
  onValueChange?: (date: Date) => void;
  disabled?: boolean;
  preserveTime?: boolean;
};

export function DateField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  minimumDate,
  maximumDate,
  onValueChange,
  disabled = false,
  preserveTime = false,
}: DateFieldProps<T>) {
  const { t, i18n } = useTranslation();
  const { field, fieldState } = useController({ control, name });
  const selectedDate: Date | undefined = field.value;
  const errorKey = fieldState.error?.message;

  return (
    <View style={styles.container}>
      <FieldShell label={label} errorKey={errorKey}>
        <FieldValue
          label={label}
          text={selectedDate ? formatLongDate(selectedDate, i18n.language) : placeholder}
          symbol="calendar"
          isPlaceholder={!selectedDate}
          hasError={!!errorKey}
        />
      </FieldShell>
      <Calendar
        key={selectedDate?.getTime()}
        value={selectedDate}
        locale={i18n.language}
        previousLabel={t('common.previous')}
        nextLabel={t('common.next')}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        disabled={disabled}
        onChange={(day) => {
          const date = preserveTime && selectedDate ? withTime(day, toTimeValue(selectedDate)) : day;

          field.onChange(date);
          onValueChange?.(date);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
});
