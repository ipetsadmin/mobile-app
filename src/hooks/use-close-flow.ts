import { useNavigation } from 'expo-router';

export function useCloseFlow() {
  const navigation = useNavigation();

  return () => (navigation.getParent() ?? navigation).goBack();
}
