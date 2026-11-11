import { router } from "expo-router";

import { BreedStepScreen } from "@/features/pets";

export default function NewCompanionBreedRoute() {
  return <BreedStepScreen onNext={() => router.push("/new-companion/sex")} />;
}
