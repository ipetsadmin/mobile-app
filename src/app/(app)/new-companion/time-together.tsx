import { router } from "expo-router";

import { TimeTogetherStepScreen } from "@/features/pets";

export default function NewCompanionTimeTogetherRoute() {
  return (
    <TimeTogetherStepScreen
      onNext={() => router.push("/new-companion/weight")}
    />
  );
}
