import { useLocalSearchParams } from 'expo-router';

import { HealthCardScreen } from '@/features/pets';

export default function HealthCardRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return <HealthCardScreen petId={petId} />;
}
