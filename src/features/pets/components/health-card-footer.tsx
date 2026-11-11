import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export function HealthCardFooter() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.footer}>
      <View style={styles.row}>
        <ThemedText type="label">{t("healthCard.tagline")}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText type="heading">{t("common.brandName")}</ThemedText>
        <View style={[styles.dot, { backgroundColor: theme.accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
  },
});
