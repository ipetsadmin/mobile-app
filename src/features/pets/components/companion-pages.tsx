import type { PetResponse } from "@ipetsadmin/contracts";
import type { Ref } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import PagerView, {
  type PagerViewOnPageScrollEvent,
  type PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";

import { queryKeys } from "@/constants/query-keys";
import { Spacing } from "@/constants/theme";
import { AppointmentList } from "@/features/appointments";
import { TreatmentList, VaccineList } from "@/features/health";
import { usePullRefresh } from "@/hooks/use-pull-refresh";

import { CompanionOverview } from "./companion-overview";

const FLOATING_BUTTON_CLEARANCE = 112;

type CompanionPagesProps = {
  pet: PetResponse;
  caretakerName: string;
  pagerRef: Ref<PagerView>;
  onPageScroll: (event: PagerViewOnPageScrollEvent) => void;
  onPageSelected: (event: PagerViewOnPageSelectedEvent) => void;
};

export function CompanionPages({
  pet,
  caretakerName,
  pagerRef,
  onPageScroll,
  onPageSelected,
}: CompanionPagesProps) {
  const { isRefreshing, onRefresh } = usePullRefresh([
    queryKeys.pets.detail(pet.id),
    queryKeys.treatments.list(pet.id),
    queryKeys.appointments.list(pet.id),
  ]);
  const refreshControl = <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />;

  return (
    <PagerView
      ref={pagerRef}
      style={styles.pager}
      initialPage={0}
      onPageScroll={onPageScroll}
      onPageSelected={onPageSelected}
    >
      <View key="overview" collapsable={false}>
        <ScrollView contentContainerStyle={styles.content} refreshControl={refreshControl}>
          <CompanionOverview pet={pet} caretakerName={caretakerName} />
        </ScrollView>
      </View>
      <View key="health" collapsable={false}>
        <ScrollView contentContainerStyle={styles.content} refreshControl={refreshControl}>
          <TreatmentList petId={pet.id} />
          <VaccineList petId={pet.id} />
        </ScrollView>
      </View>
      <View key="appointments" collapsable={false}>
        <ScrollView contentContainerStyle={styles.content} refreshControl={refreshControl}>
          <AppointmentList petId={pet.id} />
        </ScrollView>
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
  content: {
    gap: Spacing.lg,
    padding: Spacing.lg,
    paddingBottom: FLOATING_BUTTON_CLEARANCE,
  },
});
