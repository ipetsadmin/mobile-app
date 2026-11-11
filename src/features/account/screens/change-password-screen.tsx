import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { FormScrollView } from '@/components/form/form-scroll-view';
import { PasswordField } from '@/components/form/password-field';
import { ThemedView } from '@/components/themed-view';

import { useChangePasswordForm } from '../hooks/use-change-password-form';

type ChangePasswordScreenProps = {
  onPasswordChanged: () => void;
};

export function ChangePasswordScreen({ onPasswordChanged }: ChangePasswordScreenProps) {
  const { t } = useTranslation();
  const { control, setFocus, submit, isPending } = useChangePasswordForm({ onPasswordChanged });

  return (
    <ThemedView style={styles.screen}>
      <FormScrollView>
        <PasswordField
          control={control}
          name="currentPassword"
          label={t('account.password.current')}
          placeholder={t('account.password.placeholder')}
          returnKeyType="next"
          onSubmitEditing={() => setFocus('newPassword')}
        />
        <PasswordField
          control={control}
          name="newPassword"
          label={t('account.password.new')}
          placeholder={t('account.password.placeholder')}
          hint={t('account.password.hint')}
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => setFocus('confirmPassword')}
        />
        <PasswordField
          control={control}
          name="confirmPassword"
          label={t('account.password.confirm')}
          placeholder={t('account.password.placeholder')}
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <Button
          size="lg"
          title={t('account.password.submit')}
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
