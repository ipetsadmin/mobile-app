import { router } from 'expo-router';

import { SignInScreen } from '@/features/auth';

export default function SignInRoute() {
  return (
    <SignInScreen
      onForgotPassword={() => router.push('/reset-password')}
      onCreateAccount={() => router.push('/sign-up')}
      onEmailNotVerified={(email) => router.push({ pathname: '/verify-email', params: { email } })}
    />
  );
}
