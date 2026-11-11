import { router, useLocalSearchParams } from "expo-router";

import { MicrochipStepScreen } from "@/features/pets";

export default function EditCompanionMicrochipRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return (
    <MicrochipStepScreen
      onNext={() =>
        router.push({
          pathname: "/edit-companion/[petId]/photo",
          params: { petId },
        })
      }
    />
  );
}
