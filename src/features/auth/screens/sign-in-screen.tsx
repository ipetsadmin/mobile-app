import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { CornerGlow } from '@/components/corner-glow';
import { FormScrollView } from '@/components/form/form-scroll-view';
import { PasswordField } from '@/components/form/password-field';
import { TextField } from '@/components/form/text-field';
import { TextButton } from '@/components/text-button';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import { AuthHeader } from '../components/auth-header';
import { OrDivider } from '../components/or-divider';
import { SocialSignIn } from '../components/social-sign-in';
import { useSignInForm } from '../hooks/use-sign-in-form';

type SignInScreenProps = {
  onForgotPassword: () => void;
  onCreateAccount: () => void;
  onEmailNotVerified: (email: string) => void;
};

export function SignInScreen({
  onForgotPassword,
  onCreateAccount,
  onEmailNotVerified,
}: SignInScreenProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { control, submit, focusPassword, isPending, continueWith } = useSignInForm({ onEmailNotVerified });

  return (
    <ThemedView style={styles.screen}>
      <CornerGlow />
      <FormScrollView contentContainerStyle={{ paddingTop: insets.top + Spacing.xl }}>
        <AuthHeader showBrandMark title={t('signIn.title')} subtitle={t('signIn.subtitle')} />
        <View style={styles.group}>
          <TextField
            control={control}
            name="email"
            label={t('signIn.email')}
            placeholder={t('signIn.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={focusPassword}
          />
          <PasswordField
            control={control}
            name="password"
            label={t('signIn.password')}
            placeholder={t('signIn.passwordPlaceholder')}
            returnKeyType="go"
            onSubmitEditing={submit}
          />
          <TextButton
            title={t('signIn.forgotPassword')}
            style={styles.forgotPassword}
            onPress={onForgotPassword}
          />
        </View>
        <View style={styles.group}>
          <Button size="lg" title={t('signIn.submit')} loading={isPending} onPress={submit} />
          <OrDivider label={t('signIn.or')} />
          <SocialSignIn
            onContinueWithGoogle={() => continueWith('google')}
            onContinueWithApple={() => continueWith('apple')}
          />
          <TextButton
            title={t('signIn.createAccount')}
            style={styles.createAccount}
            onPress={onCreateAccount}
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
  group: {
    gap: Spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  createAccount: {
    alignSelf: 'center',
  },
});
