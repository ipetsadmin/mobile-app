import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { FormScrollView } from '@/components/form/form-scroll-view';
import { PasswordField } from '@/components/form/password-field';
import { ThemedView } from '@/components/themed-view';

import { AuthHeader } from '../components/auth-header';
import { useNewPasswordForm } from '../hooks/use-new-password-form';

type NewPasswordScreenProps = {
  token: string;
  onPasswordSet: () => void;
};

export function NewPasswordScreen({ token, onPasswordSet }: NewPasswordScreenProps) {
  const { t } = useTranslation();
  const { control, submit, focusConfirm, isPending } = useNewPasswordForm({ token, onPasswordSet });

  return (
    <ThemedView style={styles.screen}>
      <FormScrollView>
        <AuthHeader title={t('newPassword.title')} subtitle={t('newPassword.subtitle')} />
        <PasswordField
          control={control}
          name="newPassword"
          label={t('newPassword.password')}
          placeholder={t('account.password.placeholder')}
          hint={t('account.password.hint')}
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={focusConfirm}
        />
        <PasswordField
          control={control}
          name="confirmPassword"
          label={t('newPassword.confirm')}
          placeholder={t('account.password.placeholder')}
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <Button size="lg" title={t('newPassword.submit')} loading={isPending} onPress={submit} />
      </FormScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
