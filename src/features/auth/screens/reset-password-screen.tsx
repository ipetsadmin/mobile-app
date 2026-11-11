import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { FormScrollView } from '@/components/form/form-scroll-view';
import { TextField } from '@/components/form/text-field';
import { ThemedView } from '@/components/themed-view';

import { AuthHeader } from '../components/auth-header';
import { useResetPasswordForm } from '../hooks/use-reset-password-form';

type ResetPasswordScreenProps = {
  onRequested: () => void;
};

export function ResetPasswordScreen({ onRequested }: ResetPasswordScreenProps) {
  const { t } = useTranslation();
  const { control, submit, isPending } = useResetPasswordForm({ onRequested });

  return (
    <ThemedView style={styles.screen}>
      <FormScrollView>
        <AuthHeader title={t('resetPassword.title')} subtitle={t('resetPassword.subtitle')} />
        <TextField
          control={control}
          name="email"
          label={t('resetPassword.email')}
          placeholder={t('resetPassword.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          returnKeyType="send"
          onSubmitEditing={submit}
        />
        <Button
          size="lg"
          title={t('resetPassword.submit')}
          loading={isPending}
          onPress={submit}
        />
      </FormScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
