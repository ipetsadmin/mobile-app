import { router } from "expo-router";

import { NameStepScreen } from "@/features/pets";

export default function NewCompanionNameRoute() {
  return <NameStepScreen onNext={() => router.push("/new-companion/breed")} />;
}
