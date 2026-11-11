import { useLocalSearchParams } from "expo-router";

import { PhotoStepScreen } from "@/features/pets";
import { useCloseFlow } from "@/hooks/use-close-flow";

export default function EditCompanionPhotoRoute() {
  const closeFlow = useCloseFlow();
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return <PhotoStepScreen petId={petId} onSaved={closeFlow} />;
}
