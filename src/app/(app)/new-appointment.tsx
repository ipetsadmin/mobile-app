import { router, useLocalSearchParams } from 'expo-router';

import { NewAppointmentScreen } from '@/features/appointments';

export default function NewAppointmentRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return <NewAppointmentScreen petId={petId} onAppointmentSaved={() => router.back()} />;
}
