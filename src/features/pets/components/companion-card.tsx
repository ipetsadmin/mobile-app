import type { PetResponse } from "@ipetsadmin/contracts";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getAge } from "@/utils/get-age";

import { PetAvatar } from "./pet-avatar";
import { ageKeys, genderKeys, weightUnitKeys } from "./pet-labels";

type CompanionCardProps = {
  pet: PetResponse;
  onPress: () => void;
};

export function CompanionCard({ pet, onPress }: CompanionCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const age = getAge(pet.birthDate.date, new Date());
  const details = [
    t(ageKeys[age.unit], { count: age.count }),
    t(genderKeys[pet.gender]),
    `${pet.weight} ${t(weightUnitKeys[pet.weightUnit])}`,
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={pet.name}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <PetAvatar species={pet.species} photoUrl={pet.photos[0]?.url} />
      <View style={styles.texts}>
        <ThemedText type="subheading">{pet.name}</ThemedText>
        <ThemedText type="body">{pet.breed}</ThemedText>
        <ThemedText type="bodySmall">{details.join(" · ")}</ThemedText>
      </View>
      <SymbolView
        name={{
          ios: "chevron.right",
          android: "chevron_right",
          web: "chevron_right",
        }}
        size={14}
        weight="semibold"
        tintColor={theme.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    paddingRight: Spacing.lg,
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: "continuous",
  },
  texts: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
