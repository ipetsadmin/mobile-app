import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { VerifyAccountScreen } from '@/features/auth';

export default function VerifyAccountRoute() {
  const { email } = useLocalSearchParams<{ email?: string | string[] }>();
  const verifiedEmail = Array.isArray(email) ? email[0] : email;

  if (!verifiedEmail) return <Redirect href="/" />;

  return <VerifyAccountScreen email={verifiedEmail} onGoToSignIn={() => router.replace('/')} />;
}
