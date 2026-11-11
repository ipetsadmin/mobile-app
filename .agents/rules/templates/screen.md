# Template: pantalla

Ejemplo completo del inicio de sesión dentro de la feature `auth`: ruta, pantalla, hook del formulario, schema y hook de datos. Reglas en [`../architecture.md`](../architecture.md), [`../forms.md`](../forms.md) y [`../components.md`](../components.md).

```
src/app/(public)/sign-in.tsx
src/features/auth/
├── screens/sign-in-screen.tsx
├── hooks/use-sign-in-form.ts
├── schema/sign-in.schema.ts
├── data/use-sign-in.ts
└── index.ts
```

## `src/app/(public)/sign-in.tsx`

La ruta renderiza la pantalla y decide la navegación. Es el único archivo que importa `expo-router`.

```tsx
import { router } from 'expo-router';

import { SignInScreen } from '@/features/auth';

export default function SignInRoute() {
  return (
    <SignInScreen
      onForgotPassword={() => router.push('/forgot-password')}
      onCreateAccount={() => router.push('/sign-up')}
    />
  );
}
```

Después de iniciar sesión no hay navegación explícita: la sesión cambia y el layout protegido muestra las rutas privadas.

Una ruta con parámetros los lee y los pasa como props:

```tsx
import { router, useLocalSearchParams } from 'expo-router';

import { PetDetailScreen } from '@/features/pets';

export default function PetDetailRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return <PetDetailScreen petId={petId} onClose={() => router.back()} />;
}
```

## `schema/sign-in.schema.ts`

```ts
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('validation.emailInvalid'),
  password: z.string().min(1, 'validation.required'),
});

export type SignInValues = z.infer<typeof signInSchema>;
```

## `data/use-sign-in.ts`

```ts
import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import type { SignInValues } from '../schema/sign-in.schema';
import { useSession } from './use-session';

export function useSignIn() {
  const { startSession } = useSession();

  return useMutation({
    mutationFn: (values: SignInValues) => apiClient.auth.login(values),
    onSuccess: (response) => {
      if (response.data) startSession(response.data);
    },
  });
}
```

## `hooks/use-sign-in-form.ts`

Une el formulario con la mutación y devuelve solo lo que la pantalla necesita.

```ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useSignIn } from '../data/use-sign-in';
import { signInSchema, type SignInValues } from '../schema/sign-in.schema';

export function useSignInForm() {
  const { control, handleSubmit } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const { mutate, isPending, isError } = useSignIn();

  const submit = handleSubmit((values) => mutate(values));

  return { control, submit, isPending, isError };
}
```

Cuando la pantalla debe reaccionar al éxito, el hook recibe el callback y lo pasa a `mutate`:

```ts
const submit = handleSubmit((values) => mutate(values, { onSuccess: onPetCreated }));
```

## `screens/sign-in-screen.tsx`

La pantalla compone campos y botones compartidos. No importa `expo-router`, no llama al cliente y no escribe textos.

```tsx
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { TextField } from '@/components/form/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import { AuthHeader } from '../components/auth-header';
import { useSignInForm } from '../hooks/use-sign-in-form';

type SignInScreenProps = {
  onForgotPassword: () => void;
  onCreateAccount: () => void;
};

export function SignInScreen({ onForgotPassword, onCreateAccount }: SignInScreenProps) {
  const { t } = useTranslation();
  const { control, submit, isPending, isError } = useSignInForm();

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        <AuthHeader title={t('signIn.title')} subtitle={t('signIn.subtitle')} />
        <TextField
          control={control}
          name="email"
          label={t('signIn.email')}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        <TextField
          control={control}
          name="password"
          label={t('signIn.password')}
          secureTextEntry
          textContentType="password"
        />
        {isError && (
          <ThemedText type="bodySmall" themeColor="accent" selectable>
            {t('signIn.error')}
          </ThemedText>
        )}
        <Button title={t('signIn.submit')} loading={isPending} onPress={submit} />
        <Button
          variant="secondary"
          title={t('signIn.forgotPassword')}
          onPress={onForgotPassword}
        />
        <Button
          variant="secondary"
          title={t('signIn.createAccount')}
          onPress={onCreateAccount}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});
```

## `index.ts` de `auth`

```ts
export { SignInScreen } from './screens/sign-in-screen';

export { useAuthenticatedSession } from './data/use-authenticated-session';
export { useSession } from './data/use-session';
```

## Flujos de varios pasos

Cada paso es una pantalla de la feature y una ruta fina, igual que cualquier otra. El estado compartido entre pasos vive en un hook de la feature y lo monta el `_layout.tsx` del grupo de rutas.

## Cuándo extraer

- A `components/` de la feature: cuando la pantalla se acerca a su límite de líneas o tiene una sección con nombre propio (encabezado, lista, estado vacío).
- A `hooks/` de la feature: cuando la pantalla tiene un formulario, filtros o estado que combina más de un hook de datos.
- A `src/components/` o `src/hooks/`: cuando una segunda feature lo necesita.
