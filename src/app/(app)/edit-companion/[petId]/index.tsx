import { router, useLocalSearchParams } from "expo-router";

import { PetTypeStepScreen } from "@/features/pets";

export default function EditCompanionPetTypeRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return (
    <PetTypeStepScreen
      onNext={() =>
        router.push({
          pathname: "/edit-companion/[petId]/name",
          params: { petId },
        })
      }
    />
  );
}
