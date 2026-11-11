import type { PetResponse } from "@ipetsadmin/contracts";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

import { PetAvatar } from "./pet-avatar";
import { genderKeys } from "./pet-labels";

type CompanionHeaderProps = {
  pet: PetResponse;
};

export function CompanionHeader({ pet }: CompanionHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <PetAvatar species={pet.species} photoUrl={pet.photos[0]?.url} />
      <View style={styles.texts}>
        <ThemedText type="title" numberOfLines={1}>
          {pet.name}
        </ThemedText>
        <ThemedText type="body">{`${pet.breed} · ${t(genderKeys[pet.gender])}`}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  texts: {
    flex: 1,
  },
});
