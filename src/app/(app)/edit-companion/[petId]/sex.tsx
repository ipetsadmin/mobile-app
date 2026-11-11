import { router, useLocalSearchParams } from "expo-router";

import { SexStepScreen } from "@/features/pets";

export default function EditCompanionSexRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return (
    <SexStepScreen
      onNext={() =>
        router.push({
          pathname: "/edit-companion/[petId]/birth-date",
          params: { petId },
        })
      }
    />
  );
}
