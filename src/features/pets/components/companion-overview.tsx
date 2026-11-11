import type { PetResponse } from "@ipetsadmin/contracts";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { NextAppointment } from "@/features/appointments";
import { ActiveTreatments } from "@/features/health";
import { getDaysBetween } from "@/utils/calendar";
import { formatMediumDate } from "@/utils/format-date";
import { getAge } from "@/utils/get-age";

import { ageKeys, weightUnitKeys } from "./pet-labels";
import { StatTile } from "./stat-tile";

type CompanionOverviewProps = {
  pet: PetResponse;
  caretakerName: string;
};

export function CompanionOverview({
  pet,
  caretakerName,
}: CompanionOverviewProps) {
  const { t, i18n } = useTranslation();
  const today = new Date();
  const age = getAge(pet.birthDate.date, today);
  const daysTogether = getDaysBetween(pet.beenWithUsSince.date, today);

  return (
    <View style={styles.container}>
      <NextAppointment petId={pet.id} />
      <ActiveTreatments petId={pet.id} />
      <View style={styles.grid}>
        <StatTile
          label={t("healthCard.stats.together")}
          value={t("healthCard.days", { count: daysTogether })}
        />
        <StatTile
          label={t("healthCard.stats.age")}
          value={t(ageKeys[age.unit], { count: age.count })}
        />
        <StatTile
          label={t("healthCard.born")}
          value={formatMediumDate(pet.birthDate.date, i18n.language)}
        />
        <StatTile
          label={t("healthCard.weight")}
          value={`${pet.weight} ${t(weightUnitKeys[pet.weightUnit])}`}
        />
        <StatTile
          label={t("healthCard.stats.neutered")}
          value={pet.isNeutered ? t("common.yes") : t("common.no")}
        />
        <StatTile
          label={t("healthCard.microchip")}
          value={pet.microchipNumber ?? t("healthCard.noMicrochip")}
        />
        <StatTile label={t("healthCard.caretaker")} value={caretakerName} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
});
