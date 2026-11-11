import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { FieldControl } from '@/components/field-control';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SearchInputProps = {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
};

export function SearchInput({ value, placeholder, onChangeText }: SearchInputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FieldControl isFocused={isFocused}>
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={18}
        tintColor={theme.textSecondary}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
        style={[styles.input, { color: theme.text }]}
      />
    </FieldControl>
  );
}

const styles = StyleSheet.create({
  input: {
    ...Typography.body,
    flex: 1,
    paddingVertical: Spacing.sm,
  },
});
