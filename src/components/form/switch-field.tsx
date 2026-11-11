import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { ThemedSwitch } from '@/components/themed-switch';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SwitchFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  onLabel: string;
  offLabel: string;
  onValueChange?: (value: boolean) => void;
};

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  onLabel,
  offLabel,
  onValueChange,
}: SwitchFieldProps<T>) {
  const theme = useTheme();
  const { field } = useController({ control, name });
  const isOn = field.value === true;

  return (
    <View
      style={[styles.card, { backgroundColor: theme.backgroundField, borderColor: theme.border }]}>
      <View style={styles.texts}>
        <ThemedText type="button">{label}</ThemedText>
        <ThemedText type="bodySmall" themeColor="secondary">
          {isOn ? onLabel : offLabel}
        </ThemedText>
      </View>
      <ThemedSwitch
        label={label}
        value={isOn}
        onValueChange={(value) => {
          field.onChange(value);
          onValueChange?.(value);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 80,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
  },
  texts: {
    flex: 1,
    gap: Spacing['2xs'],
  },
});
