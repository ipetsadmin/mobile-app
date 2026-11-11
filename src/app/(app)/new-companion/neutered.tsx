import { router } from "expo-router";

import { NeuteredStepScreen } from "@/features/pets";

export default function NewCompanionNeuteredRoute() {
  return (
    <NeuteredStepScreen
      onNext={() => router.push("/new-companion/microchip")}
    />
  );
}
