import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FormScrollView } from '@/components/form/form-scroll-view';
import { PasswordField } from '@/components/form/password-field';
import { TextField } from '@/components/form/text-field';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import { AuthHeader } from '../components/auth-header';
import { useSignUpForm } from '../hooks/use-sign-up-form';

type SignUpScreenProps = {
  onSignedUp: (email: string) => void;
};

export function SignUpScreen({ onSignedUp }: SignUpScreenProps) {
  const { t } = useTranslation();
  const { control, submit, focusField, isPending } = useSignUpForm({ onSignedUp });

  return (
    <ThemedView style={styles.screen}>
      <FormScrollView>
        <AuthHeader title={t('signUp.title')} subtitle={t('signUp.subtitle')} />
        <View style={styles.fields}>
          <View style={styles.nameRow}>
            <TextField
              control={control}
              name="firstName"
              label={t('signUp.firstName')}
              placeholder={t('signUp.firstNamePlaceholder')}
              style={styles.nameField}
              autoCapitalize="words"
              textContentType="givenName"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => focusField('lastName')}
            />
            <TextField
              control={control}
              name="lastName"
              label={t('signUp.lastName')}
              placeholder={t('signUp.lastNamePlaceholder')}
              style={styles.nameField}
              autoCapitalize="words"
              textContentType="familyName"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => focusField('email')}
            />
          </View>
          <TextField
            control={control}
            name="email"
            label={t('signUp.email')}
            placeholder={t('signUp.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => focusField('password')}
          />
          <PasswordField
            control={control}
            name="password"
            label={t('signUp.password')}
            placeholder={t('signUp.passwordPlaceholder')}
            hint={t('signUp.passwordHint')}
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={submit}
          />
        </View>
        <Button size="lg" title={t('signUp.submit')} loading={isPending} onPress={submit} />
      </FormScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  fields: {
    gap: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  nameField: {
    flex: 1,
  },
});
