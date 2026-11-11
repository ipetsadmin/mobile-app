import { Stack, useNavigation } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { HeaderBackButton } from "@/components/header-back-button";
import { TextButton } from "@/components/text-button";
import { useSignOutAction } from "@/features/auth";
import { CompanionFormProvider, useHasPets } from "@/features/pets";
import { useHeaderOptions } from "@/hooks/use-header-options";

export default function NewCompanionLayout() {
  const { t } = useTranslation();
  const { standard } = useHeaderOptions();
  const navigation = useNavigation();
  const { hasPets } = useHasPets();
  const [canLeave] = useState(hasPets);
  const confirmSignOut = useSignOutAction();
  const close = () => navigation.goBack();

  return (
    <CompanionFormProvider>
      <Stack
        screenOptions={{
          title: "",
          ...standard,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerRight: () =>
              canLeave ? null : (
                <TextButton title={t("account.signOut")} onPress={confirmSignOut} />
              ),
            headerLeft: () =>
              canLeave ? (
                <HeaderBackButton label={t("common.close")} onPress={close} />
              ) : null,
          }}
        />
      </Stack>
    </CompanionFormProvider>
  );
}
