import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

import { HeaderBackButton } from "@/components/header-back-button";
import { EditCompanionGate } from "@/features/pets";
import { useHeaderOptions } from "@/hooks/use-header-options";

export default function EditCompanionLayout() {
  const { t } = useTranslation();
  const { standard } = useHeaderOptions();
  const navigation = useNavigation();
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const close = () => navigation.goBack();

  return (
    <EditCompanionGate petId={petId} onClose={close}>
      <Stack screenOptions={{ title: "", ...standard }}>
        <Stack.Screen
          name="index"
          options={{
            headerLeft: () => (
              <HeaderBackButton label={t("common.close")} onPress={close} />
            ),
          }}
        />
      </Stack>
    </EditCompanionGate>
  );
}
