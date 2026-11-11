import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { BackHandler } from "react-native";

import { PetTypeStepScreen, useHasPets } from "@/features/pets";

export default function NewCompanionPetTypeRoute() {
  const { hasPets } = useHasPets();

  useFocusEffect(
    useCallback(() => {
      if (hasPets) return;

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );

      return () => subscription.remove();
    }, [hasPets]),
  );

  return (
    <PetTypeStepScreen onNext={() => router.push("/new-companion/name")} />
  );
}
