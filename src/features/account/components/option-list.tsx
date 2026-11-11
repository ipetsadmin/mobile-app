import { ScrollView, StyleSheet } from 'react-native';

import { OptionCard } from '@/components/option-card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Option<T extends string> = {
  value: T;
  label: string;
};

type OptionListProps<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function OptionList<T extends string>({
  label,
  options,
  value,
  onChange,
}: OptionListProps<T>) {
  const theme = useTheme();

  return (
    <ScrollView
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}>
      {options.map((option) => (
        <OptionCard
          key={option.value}
          label={option.label}
          selected={option.value === value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.md,
    padding: Spacing.lg,
  },
});
