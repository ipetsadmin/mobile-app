import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import type PagerView from "react-native-pager-view";
import { useSharedValue } from "react-native-reanimated";

import { StatusMessage } from "@/components/status-message";
import { Spacing } from "@/constants/theme";
import { useAccount } from "@/features/account";
import { useTheme } from "@/hooks/use-theme";

import { CompanionAddMenu } from "../components/companion-add-menu";
import { CompanionHeader } from "../components/companion-header";
import { CompanionPages } from "../components/companion-pages";
import { DetailTabs } from "../components/detail-tabs";
import { usePet } from "../data/use-pet";
import { companionTabs, type CompanionTab } from "../utils/companion-tab";

type CompanionDetailScreenProps = {
  petId: string;
  onAddVaccine: () => void;
  onAddAppointment: () => void;
  onAddTreatment: () => void;
};

export function CompanionDetailScreen({
  petId,
  onAddVaccine,
  onAddAppointment,
  onAddTreatment,
}: CompanionDetailScreenProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: pet, isPending, isError, refetch } = usePet(petId);
  const { account } = useAccount();
  const pagerRef = useRef<PagerView>(null);
  const progress = useSharedValue(0);
  const [tab, setTab] = useState<CompanionTab>("overview");

  if (!pet) {
    return (
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.status}
      >
        {isPending && <StatusMessage />}
        {isError && (
          <StatusMessage
            message={t("common.loadError")}
            actionLabel={t("common.retry")}
            onAction={refetch}
          />
        )}
        {!isPending && !isError && (
          <StatusMessage message={t("healthCard.notFound")} />
        )}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.top}>
        <CompanionHeader pet={pet} />
        <DetailTabs
          value={tab}
          progress={progress}
          onChange={(value) =>
            pagerRef.current?.setPage(companionTabs.indexOf(value))
          }
          tabs={[
            { value: "overview", label: t("healthCard.tabs.overview") },
            { value: "health", label: t("healthCard.tabs.health") },
            { value: "appointments", label: t("healthCard.tabs.appointments") },
          ]}
        />
      </View>
      <CompanionPages
        pet={pet}
        caretakerName={account.name}
        pagerRef={pagerRef}
        onPageScroll={(event) => {
          progress.set(event.nativeEvent.position + event.nativeEvent.offset);
        }}
        onPageSelected={(event) =>
          setTab(companionTabs[event.nativeEvent.position])
        }
      />
      <CompanionAddMenu
        tab={tab}
        onAddVaccine={onAddVaccine}
        onAddAppointment={onAddAppointment}
        onAddTreatment={onAddTreatment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  top: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  status: {
    padding: Spacing.lg,
  },
});
