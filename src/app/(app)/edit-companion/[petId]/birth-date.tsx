import { router, useLocalSearchParams } from "expo-router";

import { BirthDateStepScreen } from "@/features/pets";

export default function EditCompanionBirthDateRoute() {
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return (
    <BirthDateStepScreen
      onNext={() =>
        router.push({
          pathname: "/edit-companion/[petId]/time-together",
          params: { petId },
        })
      }
    />
  );
}
