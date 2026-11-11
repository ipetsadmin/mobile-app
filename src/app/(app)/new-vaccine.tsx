import { router, useLocalSearchParams } from 'expo-router';

import { NewVaccineScreen } from '@/features/health';

export default function NewVaccineRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return <NewVaccineScreen petId={petId} onVaccineSaved={() => router.back()} />;
}
