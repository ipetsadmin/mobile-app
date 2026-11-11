import { router } from 'expo-router';

import { HomeScreen } from '@/features/home';

export default function HomeRoute() {
  return (
    <HomeScreen
      onOpenNotifications={() => router.push('/notifications')}
      onNewCompanion={() => router.push('/new-companion')}
      onOpenCompanion={(petId) =>
        router.push({ pathname: '/companions/[petId]', params: { petId } })
      }
    />
  );
}
