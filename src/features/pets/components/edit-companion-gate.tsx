import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeaderBackButton } from "@/components/header-back-button";
import { StatusMessage } from "@/components/status-message";
import { Spacing } from "@/constants/theme";

import { usePet } from "../data/use-pet";
import { CompanionFormProvider } from "./companion-form-provider";

type EditCompanionGateProps = PropsWithChildren<{
  petId: string;
  onClose: () => void;
}>;

export function EditCompanionGate({
  petId,
  onClose,
  children,
}: EditCompanionGateProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: pet, isError, refetch } = usePet(petId);

  if (pet) {
    return <CompanionFormProvider pet={pet}>{children}</CompanionFormProvider>;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.md }]}>
      <HeaderBackButton label={t("common.close")} onPress={onClose} />
      {isError ? (
        <StatusMessage
          message={t("common.loadError")}
          actionLabel={t("common.retry")}
          onAction={refetch}
        />
      ) : (
        <StatusMessage />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
});
