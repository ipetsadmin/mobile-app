import { router, useLocalSearchParams } from "expo-router";

import { NeuteredStepScreen } from "@/features/pets";

export default function EditCompanionNeuteredRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return (
    <NeuteredStepScreen
      onNext={() =>
        router.push({
          pathname: "/edit-companion/[petId]/microchip",
          params: { petId },
        })
      }
    />
  );
}
