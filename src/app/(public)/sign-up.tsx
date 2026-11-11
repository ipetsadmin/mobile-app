import { router } from 'expo-router';

import { SignUpScreen } from '@/features/auth';

export default function SignUpRoute() {
  return (
    <SignUpScreen
      onSignedUp={(email) => router.replace({ pathname: '/verify-email', params: { email } })}
    />
  );
}
