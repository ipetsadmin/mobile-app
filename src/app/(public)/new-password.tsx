import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { NewPasswordScreen } from '@/features/auth';

export default function NewPasswordRoute() {
  const { token } = useLocalSearchParams<{ token?: string | string[] }>();
  const resetToken = Array.isArray(token) ? token[0] : token;

  if (!resetToken) return <Redirect href="/" />;

  return <NewPasswordScreen token={resetToken} onPasswordSet={() => router.replace('/')} />;
}
