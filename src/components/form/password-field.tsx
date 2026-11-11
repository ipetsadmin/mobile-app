import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { TextField, type TextFieldProps } from './text-field';

type PasswordFieldProps<T extends FieldValues> = Omit<
  TextFieldProps<T>,
  'trailing' | 'secureTextEntry'
>;

export function PasswordField<T extends FieldValues>(props: PasswordFieldProps<T>) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isHidden, setIsHidden] = useState(true);
  const symbol = isHidden ? 'visibility' : 'visibility_off';

  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      {...props}
      secureTextEntry={isHidden}
      trailing={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(isHidden ? 'common.showPassword' : 'common.hidePassword')}
          hitSlop={12}
          onPress={() => setIsHidden((current) => !current)}>
          <SymbolView
            name={{ ios: isHidden ? 'eye' : 'eye.slash', android: symbol, web: symbol }}
            size={22}
            tintColor={theme.textSecondary}
          />
        </Pressable>
      }
    />
  );
}
