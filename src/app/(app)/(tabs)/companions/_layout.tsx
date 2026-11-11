import { Stack } from 'expo-router';

import { useHeaderOptions } from '@/hooks/use-header-options';

export const unstable_settings = {
  anchor: 'index',
};

export default function CompanionsTabLayout() {
  const { standard } = useHeaderOptions();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[petId]"
        options={{ headerShown: true, ...standard, title: '' }}
      />
    </Stack>
  );
}
