import { router, useLocalSearchParams } from "expo-router";

import { TimeTogetherStepScreen } from "@/features/pets";

export default function EditCompanionTimeTogetherRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return (
    <TimeTogetherStepScreen
      onNext={() =>
        router.push({
          pathname: "/edit-companion/[petId]/weight",
          params: { petId },
        })
      }
    />
  );
}
