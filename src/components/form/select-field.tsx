import { useState } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';

import { FieldValue } from '@/components/field-value';
import { SelectSheet, type SelectOption } from '@/components/select-sheet';

import { FieldShell } from './field-shell';

type SelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  options: SelectOption[];
  sheetTitle: string;
  searchPlaceholder?: string;
  emptyText: string;
};

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  sheetTitle,
  searchPlaceholder,
  emptyText,
}: SelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const { field, fieldState } = useController({ control, name });
  const selectedOption = options.find((option) => option.value === field.value);
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
        searchPlaceholder={searchPlaceholder}
        emptyText={emptyText}
        onSelect={(value) => {
          field.onChange(value);
          setIsOpen(false);
        }}
        onClose={() => setIsOpen(false)}
      />
    </FieldShell>
  );
}
