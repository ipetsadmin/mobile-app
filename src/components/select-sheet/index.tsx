import { BottomSheet, RNHostView } from '@expo/ui';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchInput } from '@/components/search-input';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalizeText } from '@/utils/normalize-text';

import type { SelectOption } from './select-option';
import { SelectOptionList } from './select-option-list';
import { sheetModifiers } from './sheet-modifiers';

export type { SelectOption };

type SelectSheetProps = {
  isOpen: boolean;
  title: string;
  options: SelectOption[];
  selectedValue?: string;
  searchPlaceholder?: string;
  emptyText: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

export function SelectSheet({
  isOpen,
  title,
  options,
  selectedValue,
  searchPlaceholder,
  emptyText,
  onSelect,
  onClose,
}: SelectSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const [search, setSearch] = useState('');
  const query = normalizeText(search);
  const visibleOptions = options.filter((option) => normalizeText(option.label).includes(query));
  const sheetSize = { width: window.width, height: window.height - insets.top - Spacing.xs };

  return (
    <BottomSheet
      isPresented={isOpen}
      onDismiss={onClose}
      snapPoints={['full']}
      contentPadding={0}
      containerColor={theme.background}
      modifiers={sheetModifiers}>
      <RNHostView>
        <View style={[styles.sheet, sheetSize, { backgroundColor: theme.background }]}>
          <ThemedText type="heading" accessibilityRole="header">
            {title}
          </ThemedText>
          {searchPlaceholder && (
            <SearchInput value={search} placeholder={searchPlaceholder} onChangeText={setSearch} />
          )}
          <SelectOptionList
            options={visibleOptions}
            selectedValue={selectedValue}
            emptyText={emptyText}
            onSelect={onSelect}
          />
        </View>
      </RNHostView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
});
