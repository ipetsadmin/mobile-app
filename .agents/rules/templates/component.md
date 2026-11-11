# Template: componente compartido

Ejemplo completo de `src/components/button.tsx` y de un campo de formulario. Reglas en [`../components.md`](../components.md) y [`../styling.md`](../styling.md).

## `src/components/button.tsx`

Variantes y tamaños como objetos a nivel de módulo, colores desde `useTheme()`, estados presionado, deshabilitado y cargando, y `style` fusionado al final.

```tsx
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'md' | 'lg';

type ButtonProps = {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

const variantColors = {
  primary: { background: 'primary', content: 'onPrimary' },
  secondary: { background: 'secondary', content: 'onSecondary' },
} as const satisfies Record<ButtonVariant, { background: ThemeColor; content: ThemeColor }>;

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  onPress,
}: ButtonProps) {
  const theme = useTheme();
  const colors = variantColors[variant];
  const isInactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        sizes[size],
        { backgroundColor: theme[colors.background] },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={theme[colors.content]} />
      ) : (
        <ThemedText type="body" themeColor={colors.content}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.control,
    borderCurve: 'continuous',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});

const sizes = StyleSheet.create({
  md: {
    minHeight: 48,
    paddingHorizontal: Spacing.md,
  },
  lg: {
    minHeight: 56,
    paddingHorizontal: Spacing.lg,
  },
});
```

Qué muestra este ejemplo:

- El título llega ya traducido por props.
- Ningún color, espacio o radio está escrito a mano.
- La altura es mínima, no fija, para que el texto pueda crecer.
- Quien lo usa puede ajustar layout con `style`, pero no cambiar su color: para eso existe `variant`.

## `src/components/form/text-field.tsx`

Campo genérico sobre el formulario. Recibe `control` y `name`, y traduce la clave del error.

```tsx
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps<T extends FieldValues> = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  style,
  ...inputProps
}: TextFieldProps<T>) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { field, fieldState } = useController({ control, name });

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary">
        {label}
      </ThemedText>
      <TextInput
        ref={field.ref}
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        accessibilityLabel={label}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          { backgroundColor: theme.backgroundField, color: theme.text },
          style,
        ]}
        {...inputProps}
      />
      {fieldState.error?.message && (
        <ThemedText type="bodySmall" themeColor="accent">
          {t(fieldState.error.message)}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  input: {
    ...Typography.body,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.control,
    borderCurve: 'continuous',
  },
});
```

Este es el único lugar donde `Typography` se aplica sin pasar por `ThemedText`, porque un `TextInput` no puede envolverse en él.

## Componente que crece

Cuando un componente supera su límite de líneas o gana subcomponentes, pasa a ser una carpeta. La ruta de import no cambia.

```
src/components/pet-card/
├── index.tsx
├── pet-card-header.tsx
└── pet-card-footer.tsx
```

`index.tsx` exporta `PetCard`; los demás archivos son privados de la carpeta.
