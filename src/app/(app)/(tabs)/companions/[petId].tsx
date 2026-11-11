import { router, Stack, useLocalSearchParams } from 'expo-router';

import { CompanionDetailScreen, CompanionHeaderActions } from '@/features/pets';

export default function CompanionDetailRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const params = { petId };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <CompanionHeaderActions
              onOpenHealthCard={() => router.push({ pathname: '/health-card/[petId]', params })}
              onEdit={() => router.push({ pathname: '/edit-companion/[petId]', params })}
            />
          ),
        }}
      />
      <CompanionDetailScreen
        petId={petId}
        onAddVaccine={() => router.push({ pathname: '/new-vaccine', params })}
        onAddAppointment={() => router.push({ pathname: '/new-appointment', params })}
        onAddTreatment={() => router.push({ pathname: '/new-treatment', params })}
      />
    </>
  );
}
