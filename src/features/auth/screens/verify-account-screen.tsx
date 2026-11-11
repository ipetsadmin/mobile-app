import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { CodeField } from '@/components/form/code-field';
import { FormScrollView } from '@/components/form/form-scroll-view';
import { TextButton } from '@/components/text-button';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import { AuthHeader } from '../components/auth-header';
import { useResendCode } from '../hooks/use-resend-code';
import { useVerifyAccountForm } from '../hooks/use-verify-account-form';

type VerifyAccountScreenProps = {
  email: string;
  onGoToSignIn: () => void;
};

export function VerifyAccountScreen({ email, onGoToSignIn }: VerifyAccountScreenProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { control, submit, goToSignIn, isPending, isSigningIn } = useVerifyAccountForm({ email, onGoToSignIn });
  const { resend, secondsLeft, isPending: isResending } = useResendCode(email);

  return (
    <ThemedView style={styles.screen}>
      <FormScrollView contentContainerStyle={{ paddingTop: insets.top + Spacing.xl * 2 }}>
        <AuthHeader
          title={t('verifyAccount.title')}
          subtitle={t('verifyAccount.subtitle', { email })}
        />
        <View style={styles.actions}>
          <CodeField control={control} name="code" label={t('verifyAccount.code')} autoFocus />
          <Button size="lg" title={isSigningIn ? t('verifyAccount.signingIn') : t('verifyAccount.submit')} loading={isPending} onPress={submit} />
          <TextButton
            variant="plain"
            title={t('verifyAccount.goToSignIn')}
            style={styles.resend}
            onPress={goToSignIn}
          />
          <TextButton
            variant="plain"
            title={
              isResending
                ? t('verifyAccount.resending')
                : secondsLeft > 0
                  ? t('verifyAccount.resendIn', { seconds: secondsLeft })
                  : t('verifyAccount.resend')
            }
            style={styles.resend}
            onPress={resend}
          />
        </View>
      </FormScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  actions: {
    gap: Spacing.md,
  },
  resend: {
    alignSelf: 'center',
  },
});
