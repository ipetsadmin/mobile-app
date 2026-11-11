import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { FormScrollView } from "@/components/form/form-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

import { StepProgress } from "./step-progress";

const TOTAL_STEPS = 9;

type StepScaffoldProps = PropsWithChildren<{
  step: number;
  title: string;
  subtitle: string;
  actionLabel?: string;
  isLoading?: boolean;
  onNext: () => void;
}>;

export function StepScaffold({
  step,
  title,
  subtitle,
  actionLabel,
  isLoading = false,
  onNext,
  children,
}: StepScaffoldProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.screen}>
      <FormScrollView>
        <View style={styles.intro}>
          <View style={styles.progress}>
            <StepProgress current={step} total={TOTAL_STEPS} />
            <ThemedText type="label">
              {t("newCompanion.stepOf", { current: step, total: TOTAL_STEPS })}
            </ThemedText>
          </View>
          <View style={styles.heading}>
            <ThemedText type="titleSmall" accessibilityRole="header">
              {title}
            </ThemedText>
            <ThemedText type="body">{subtitle}</ThemedText>
          </View>
        </View>
        {children}
      </FormScrollView>
      <KeyboardStickyView offset={{ opened: insets.bottom }}>
        <View
          style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}
        >
          <Button
            size="lg"
            title={actionLabel ?? t("common.next")}
            loading={isLoading}
            onPress={onNext}
          />
        </View>
      </KeyboardStickyView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  intro: {
    gap: Spacing.md + Spacing["2xs"],
  },
  progress: {
    gap: Spacing.sm,
  },
  heading: {
    gap: Spacing.sm,
  },
  footer: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
});
