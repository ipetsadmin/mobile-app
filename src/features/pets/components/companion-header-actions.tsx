import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type CompanionHeaderActionsProps = {
  onOpenHealthCard: () => void;
  onEdit: () => void;
};

export function CompanionHeaderActions({
  onOpenHealthCard,
  onEdit,
}: CompanionHeaderActionsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.actions}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("healthCard.open")}
        onPress={onOpenHealthCard}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <SymbolView
          name={{ ios: "person.text.rectangle", android: "badge", web: "badge" }}
          size={22}
          weight="medium"
          tintColor={theme.text}
        />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("editCompanion.open")}
        onPress={onEdit}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <SymbolView
          name={{ ios: "pencil", android: "edit", web: "edit" }}
          size={22}
          weight="medium"
          tintColor={theme.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  action: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
