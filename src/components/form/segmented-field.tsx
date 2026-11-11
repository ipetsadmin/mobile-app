import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';

import { SegmentedControl, type SegmentOption } from '@/components/segmented-control';

type SegmentedFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SegmentOption[];
};

export function SegmentedField<T extends FieldValues>({
  control,
  name,
  label,
  options,
}: SegmentedFieldProps<T>) {
  const { field } = useController({ control, name });

  return (
    <SegmentedControl
      label={label}
      options={options}
      value={field.value}
      onChange={field.onChange}
    />
  );
}
