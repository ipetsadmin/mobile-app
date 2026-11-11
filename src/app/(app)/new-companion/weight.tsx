import { router } from "expo-router";

import { WeightStepScreen } from "@/features/pets";

export default function NewCompanionWeightRoute() {
  return (
    <WeightStepScreen onNext={() => router.push("/new-companion/neutered")} />
  );
}
