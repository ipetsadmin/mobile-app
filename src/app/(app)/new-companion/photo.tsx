import { PhotoStepScreen } from "@/features/pets";
import { useCloseFlow } from "@/hooks/use-close-flow";

export default function NewCompanionPhotoRoute() {
  const closeFlow = useCloseFlow();

  return <PhotoStepScreen onSaved={closeFlow} />;
}
