import { router, useLocalSearchParams } from "expo-router";

import { NameStepScreen } from "@/features/pets";

export default function EditCompanionNameRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return (
    <NameStepScreen
      onNext={() =>
        router.push({
          pathname: "/edit-companion/[petId]/breed",
          params: { petId },
        })
      }
    />
  );
}
