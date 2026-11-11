import { router, useLocalSearchParams } from 'expo-router';

import { NewTreatmentScreen } from '@/features/health';

export default function NewTreatmentRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return <NewTreatmentScreen petId={petId} onTreatmentSaved={() => router.back()} />;
}
