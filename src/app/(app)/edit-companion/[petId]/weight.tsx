import { router, useLocalSearchParams } from "expo-router";

import { WeightStepScreen } from "@/features/pets";

export default function EditCompanionWeightRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return (
    <WeightStepScreen
      onNext={() =>
        router.push({
          pathname: "/edit-companion/[petId]/neutered",
          params: { petId },
        })
      }
    />
  );
}
