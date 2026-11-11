import { router } from "expo-router";

import { BirthDateStepScreen } from "@/features/pets";

export default function NewCompanionBirthDateRoute() {
  return (
    <BirthDateStepScreen
      onNext={() => router.push("/new-companion/time-together")}
    />
  );
}
