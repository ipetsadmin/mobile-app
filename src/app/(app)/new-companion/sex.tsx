import { router } from "expo-router";

import { SexStepScreen } from "@/features/pets";

export default function NewCompanionSexRoute() {
  return (
    <SexStepScreen onNext={() => router.push("/new-companion/birth-date")} />
  );
}
