import { useTranslation } from "react-i18next";

import { TextField } from "@/components/form/text-field";

import { StepScaffold } from "../components/step-scaffold";
import { useCompanionStep } from "../hooks/use-companion-step";

type MicrochipStepScreenProps = {
  onNext: () => void;
};

export function MicrochipStepScreen({ onNext }: MicrochipStepScreenProps) {
  const { t } = useTranslation();
  const { control, goNext } = useCompanionStep({
    fields: ["microchipNumber"],
    onNext,
  });

  return (
    <StepScaffold
      step={8}
      title={t("newCompanion.microchip.title")}
      subtitle={t("newCompanion.microchip.subtitle")}
      onNext={goNext}
    >
      <TextField
        control={control}
        name="microchipNumber"
        label={t("newCompanion.microchip.label")}
        placeholder={t("newCompanion.microchip.placeholder")}
        hint={t("newCompanion.microchip.hint")}
        keyboardType="number-pad"
        autoFocus
      />
    </StepScaffold>
  );
}
