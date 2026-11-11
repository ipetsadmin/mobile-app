import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type CompanionsEmptyStateProps = {
  onNewCompanion: () => void;
};

export function CompanionsEmptyState({
  onNewCompanion,
}: CompanionsEmptyStateProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundSelected,
          borderColor: theme.border,
        },
      ]}
    >
      <Image
        source={require("@/assets/images/companions-empty-pattern.svg")}
        tintColor={theme.pattern}
        contentFit="cover"
        accessible={false}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.mark}>
        <BrandMark size={96} tone="text" />
      </View>
      <ThemedText type="label">{t("companions.empty.eyebrow")}</ThemedText>
      <ThemedText
        type="heading"
        accessibilityRole="header"
        style={styles.centered}
      >
        {t("companions.empty.title")}
      </ThemedText>
      <ThemedText type="body" style={styles.centered}>
        {t("companions.empty.body")}
      </ThemedText>
      <Button
        title={t("companions.newCompanion.title")}
        onPress={onNewCompanion}
        style={styles.action}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl * 2,
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  mark: {
    marginBottom: Spacing.md,
  },
  centered: {
    textAlign: "center",
  },
  action: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
});
