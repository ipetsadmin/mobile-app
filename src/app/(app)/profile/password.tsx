import { router } from 'expo-router';

import { ChangePasswordScreen } from '@/features/account';

export default function ChangePasswordRoute() {
  return <ChangePasswordScreen onPasswordChanged={() => router.back()} />;
}
