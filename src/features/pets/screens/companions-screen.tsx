import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { CompanionCard } from "../components/companion-card";
import { CompanionsListEmpty } from "../components/companions-list-empty";
import { NewCompanionCard } from "../components/new-companion-card";
import { usePets } from "../data/use-pets";

type CompanionsScreenProps = {
  onOpenCompanion: (petId: string) => void;
  onNewCompanion: () => void;
};

export function CompanionsScreen({
  onOpenCompanion,
  onNewCompanion,
}: CompanionsScreenProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { data: pets = [], isPending, isError, refetch } = usePets();
  const hasPets = pets.length > 0;

  return (
    <FlatList
      data={pets}
      keyExtractor={(pet) => pet.id}
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        process.env.EXPO_OS !== "ios" && {
          paddingTop: insets.top + Spacing.lg,
        },
      ]}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText type="title" accessibilityRole="header">
            {t("companions.title")}
          </ThemedText>
          <ThemedText type="body">{t("companions.subtitle")}</ThemedText>
          {hasPets && <NewCompanionCard onPress={onNewCompanion} />}
        </View>
      }
      renderItem={({ item }) => (
        <CompanionCard pet={item} onPress={() => onOpenCompanion(item.id)} />
      )}
      ListEmptyComponent={
        <CompanionsListEmpty
          isPending={isPending}
          isError={isError}
          onRetry={refetch}
          onNewCompanion={onNewCompanion}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});
