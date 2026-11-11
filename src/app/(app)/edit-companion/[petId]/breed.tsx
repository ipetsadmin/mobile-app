import { router, useLocalSearchParams } from "expo-router";

import { BreedStepScreen } from "@/features/pets";

export default function EditCompanionBreedRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return (
    <BreedStepScreen
      onNext={() =>
        router.push({
          pathname: "/edit-companion/[petId]/sex",
          params: { petId },
        })
      }
    />
  );
}
