import { router } from 'expo-router';

import { ResetPasswordScreen } from '@/features/auth';

export default function ResetPasswordRoute() {
  return <ResetPasswordScreen onRequested={() => router.back()} />;
}
