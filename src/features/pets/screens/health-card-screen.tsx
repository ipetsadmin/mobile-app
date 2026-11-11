import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

import { StatusMessage } from "@/components/status-message";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useAccount } from "@/features/account";
import { useTheme } from "@/hooks/use-theme";

import { HealthCard } from "../components/health-card";
import { TiltCard } from "../components/tilt-card";
import { usePet } from "../data/use-pet";
import { useShareHealthCard } from "../hooks/use-share-health-card";

type HealthCardScreenProps = {
  petId: string;
};

export function HealthCardScreen({ petId }: HealthCardScreenProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: pet, isPending, isError, refetch } = usePet(petId);
  const { account } = useAccount();
  const shareHealthCard = useShareHealthCard(pet?.name);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
    >
      {isPending && <StatusMessage />}
      {isError && (
        <StatusMessage
          message={t("common.loadError")}
          actionLabel={t("common.retry")}
          onAction={refetch}
        />
      )}
      {!isPending && !isError && !pet && (
        <StatusMessage message={t("healthCard.notFound")} />
      )}
      {pet && (
        <>
          <TiltCard>
            <HealthCard
              pet={pet}
              caretakerName={account.name}
              onShare={shareHealthCard}
            />
          </TiltCard>
          <ThemedText type="bodySmall">{t("healthCard.shareHint")}</ThemedText>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.md,
    padding: Spacing.lg,
  },
});
