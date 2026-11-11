import { useState } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldValue } from '@/components/field-value';
import { SelectSheet } from '@/components/select-sheet';
import { getTimeSlots, toTimeValue, withTime } from '@/utils/time-slots';

import { FieldShell } from './field-shell';

type TimeFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  sheetTitle: string;
  emptyText: string;
};

export function TimeField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  sheetTitle,
  emptyText,
}: TimeFieldProps<T>) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { field, fieldState } = useController({ control, name });
  const date: Date | undefined = field.value;
  const options = getTimeSlots(i18n.language);
  const selectedValue = date ? toTimeValue(date) : undefined;
  const selectedOption = options.find((option) => option.value === selectedValue);
  const errorKey = fieldState.error?.message;

  return (
    <FieldShell label={label} errorKey={errorKey}>
      <FieldValue
        label={label}
        text={selectedOption?.label ?? placeholder}
        symbol="chevron"
        isPlaceholder={!selectedOption}
        isFilled={!!selectedOption}
        hasError={!!errorKey}
        onPress={() => setIsOpen(true)}
      />
      <SelectSheet
        isOpen={isOpen}
        title={sheetTitle}
        options={options}
        selectedValue={selectedOption?.value}
        emptyText={emptyText}
        onSelect={(value) => {
          field.onChange(withTime(date ?? new Date(), value));
          setIsOpen(false);
        }}
        onClose={() => setIsOpen(false)}
      />
    </FieldShell>
  );
}
