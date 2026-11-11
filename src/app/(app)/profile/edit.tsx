import { router } from 'expo-router';

import { EditProfileScreen } from '@/features/account';

export default function EditProfileRoute() {
  return <EditProfileScreen onProfileSaved={() => router.back()} />;
}
