import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type HeaderBackButtonProps = {
  label: string;
  onPress: () => void;
};

export function HeaderBackButton({ label, onPress }: HeaderBackButtonProps) {
  const theme = useTheme();

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={12} onPress={onPress}>
      <SymbolView
        name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
        size={20}
        weight="semibold"
        tintColor={theme.text}
      />
    </Pressable>
  );
}
