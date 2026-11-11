import { router } from 'expo-router';

import { CompanionsScreen } from '@/features/pets';

export default function CompanionsRoute() {
  return (
    <CompanionsScreen
      onNewCompanion={() => router.push('/new-companion')}
      onOpenCompanion={(petId) =>
        router.push({ pathname: '/companions/[petId]', params: { petId } })
      }
    />
  );
}
