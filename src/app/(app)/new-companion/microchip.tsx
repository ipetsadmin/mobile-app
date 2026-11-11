import { router } from "expo-router";

import { MicrochipStepScreen } from "@/features/pets";

export default function NewCompanionMicrochipRoute() {
  return (
    <MicrochipStepScreen onNext={() => router.push("/new-companion/photo")} />
  );
}
