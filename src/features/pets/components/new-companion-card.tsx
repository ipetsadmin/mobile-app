import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { NewCompanionBackdrop } from "./new-companion-backdrop";

type NewCompanionCardProps = {
  onPress: () => void;
};

export function NewCompanionCard({ onPress }: NewCompanionCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t("companions.newCompanion.title")}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <NewCompanionBackdrop />
      <View style={styles.icon}>
        <SymbolView
          name={{ ios: "plus", android: "add", web: "add" }}
          size={22}
          weight="medium"
          tintColor={theme.backgroundElement}
        />
      </View>
      <View style={styles.texts}>
        <ThemedText type="subheading">
          {t("companions.newCompanion.title")}
        </ThemedText>
        <ThemedText type="bodySmall">
          {t("companions.newCompanion.subtitle")}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    minHeight: 112,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  icon: {
    width: 64,
    alignItems: "center",
  },
  texts: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
