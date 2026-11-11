import { Stack } from 'expo-router';

import { useHeaderOptions } from '@/hooks/use-header-options';

export const unstable_settings = {
  anchor: 'index',
};

export default function PublicLayout() {
  const { standard } = useHeaderOptions();

  return (
    <Stack
      screenOptions={{
        title: '',
        ...standard,
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
