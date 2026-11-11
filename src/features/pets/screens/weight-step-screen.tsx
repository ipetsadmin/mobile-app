import { WeightUnit } from "@ipetsadmin/contracts";
import { useTranslation } from "react-i18next";

import { SegmentedField } from "@/components/form/segmented-field";
import { TextField } from "@/components/form/text-field";

import { Note } from "../components/note";
import { StepScaffold } from "../components/step-scaffold";
import { useCompanionStep } from "../hooks/use-companion-step";

type WeightStepScreenProps = {
  onNext: () => void;
};

export function WeightStepScreen({ onNext }: WeightStepScreenProps) {
  const { t } = useTranslation();
  const { control, goNext } = useCompanionStep({
    fields: ["weight", "weightUnit"],
    onNext,
  });

  return (
    <StepScaffold
      step={6}
      title={t("newCompanion.weight.title")}
      subtitle={t("newCompanion.weight.subtitle")}
      onNext={goNext}
    >
      <TextField
        control={control}
        name="weight"
        label={t("newCompanion.weight.label")}
        placeholder={t("newCompanion.weight.placeholder")}
        keyboardType="decimal-pad"
        autoFocus
        accessory={
          <SegmentedField
            control={control}
            name="weightUnit"
            label={t("newCompanion.weight.unitLabel")}
            options={[
              { value: WeightUnit.KG, label: t("weightUnit.kg") },
              { value: WeightUnit.LB, label: t("weightUnit.lb") },
            ]}
          />
        }
      />
      <Note text={t("newCompanion.weight.note")} />
    </StepScaffold>
  );
}
