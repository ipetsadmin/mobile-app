import type { PetResponse } from "@ipetsadmin/contracts";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatMediumDate } from "@/utils/format-date";

import { HealthCardField } from "./health-card-field";
import { HealthCardFooter } from "./health-card-footer";
import { HealthCardHeader } from "./health-card-header";
import { weightUnitKeys } from "./pet-labels";

type HealthCardProps = {
  pet: PetResponse;
  caretakerName: string;
  onShare: () => void;
};

export function HealthCard({ pet, caretakerName, onShare }: HealthCardProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const weight = `${pet.weight} ${t(weightUnitKeys[pet.weightUnit])}`;

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
        source={require("@/assets/images/health-card-backdrop.svg")}
        tintColor={theme.text}
        contentFit="cover"
        accessible={false}
        style={StyleSheet.absoluteFill}
      />
      <HealthCardHeader pet={pet} onShare={onShare} />
      <View style={styles.row}>
        <HealthCardField
          label={t("healthCard.born")}
          value={formatMediumDate(pet.birthDate.date, i18n.language)}
        />
        <HealthCardField label={t("healthCard.weight")} value={weight} />
      </View>
      <View style={styles.row}>
        <HealthCardField
          label={t("healthCard.caretaker")}
          value={caretakerName}
        />
      </View>
      <View style={[styles.row, styles.microchip]}>
        <HealthCardField
          label={t("healthCard.microchip")}
          value={pet.microchipNumber ?? t("healthCard.noMicrochip")}
        />
        <Image
          source={require("@/assets/icons/qr.svg")}
          tintColor={theme.primary}
          accessible={false}
          style={styles.qr}
        />
      </View>
      <HealthCardFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.lg,
    minHeight: 520,
    padding: Spacing.lg,
    borderWidth: 1,
    borderRadius: Radius.card,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.md,
  },
  microchip: {
    flex: 1,
    alignItems: "center",
  },
  qr: {
    width: 48,
    height: 48,
  },
});
