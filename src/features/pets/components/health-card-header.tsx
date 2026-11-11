import type { PetResponse } from "@ipetsadmin/contracts";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { PetAvatar } from "./pet-avatar";
import { genderKeys } from "./pet-labels";

type HealthCardHeaderProps = {
  pet: PetResponse;
  onShare: () => void;
};

export function HealthCardHeader({ pet, onShare }: HealthCardHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <PetAvatar species={pet.species} photoUrl={pet.photos[0]?.url} />
      <View style={styles.texts}>
        <ThemedText type="title" numberOfLines={1}>
          {pet.name}
        </ThemedText>
        <ThemedText type="bodySmall">{`${pet.breed} · ${t(genderKeys[pet.gender])}`}</ThemedText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("healthCard.share")}
        hitSlop={Spacing.sm}
        onPress={onShare}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <SymbolView
          name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
          size={22}
          weight="medium"
          tintColor={theme.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  texts: {
    flex: 1,
    alignSelf: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
