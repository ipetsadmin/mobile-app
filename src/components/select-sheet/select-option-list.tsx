import { FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { ScrollContextReset } from './scroll-context-reset';
import type { SelectOption } from './select-option';
import { SelectOptionRow } from './select-option-row';

type SelectOptionListProps = {
  options: SelectOption[];
  selectedValue?: string;
  emptyText: string;
  onSelect: (value: string) => void;
};

export function SelectOptionList({
  options,
  selectedValue,
  emptyText,
  onSelect,
}: SelectOptionListProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollContextReset>
      <FlatList
        data={options}
        keyExtractor={(option) => option.value}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
        renderItem={({ item }) => (
          <SelectOptionRow
            label={item.label}
            selected={item.value === selectedValue}
            onPress={() => onSelect(item.value)}
          />
        )}
        ListEmptyComponent={
          <ThemedText type="body" themeColor="textSecondary" style={styles.empty}>
            {emptyText}
          </ThemedText>
        }
      />
    </ScrollContextReset>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  empty: {
    paddingVertical: Spacing.lg,
    textAlign: 'center',
  },
});
