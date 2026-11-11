import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OptionGroupField } from "@/components/form/option-group-field";
import { SwitchField } from "@/components/form/switch-field";

import { StepScaffold } from "../components/step-scaffold";
import { useCompanionStep } from "../hooks/use-companion-step";
import { NotNeuteredReason } from "../schema/companion.schema";

const reasonOptions = [
  {
    value: NotNeuteredReason.TOO_YOUNG,
    labelKey: "newCompanion.neutered.tooYoung",
  },
  {
    value: NotNeuteredReason.BREED_PLANS,
    labelKey: "newCompanion.neutered.breedPlans",
  },
  {
    value: NotNeuteredReason.HEALTH_CONCERNS,
    labelKey: "newCompanion.neutered.healthConcerns",
  },
  { value: NotNeuteredReason.OTHER, labelKey: "newCompanion.neutered.other" },
] as const;

type NeuteredStepScreenProps = {
  onNext: () => void;
};

export function NeuteredStepScreen({ onNext }: NeuteredStepScreenProps) {
  const { t } = useTranslation();
  const { control, goNext, clearField } = useCompanionStep({
    fields: ["isNeutered", "notNeuteredReason"],
    onNext,
  });
  const isNeutered = useWatch({ control, name: "isNeutered" });

  return (
    <StepScaffold
      step={7}
      title={t("newCompanion.neutered.title")}
      subtitle={t("newCompanion.neutered.subtitle")}
      onNext={goNext}
    >
      <SwitchField
        control={control}
        name="isNeutered"
        label={t("newCompanion.neutered.label")}
        onLabel={t("newCompanion.neutered.yes")}
        offLabel={t("newCompanion.neutered.notYet")}
        onValueChange={() => clearField("notNeuteredReason")}
      />
      {!isNeutered && (
        <OptionGroupField
          control={control}
          name="notNeuteredReason"
          label={t("newCompanion.neutered.reasonLabel")}
          layout="inline"
          isLabelVisible
          options={reasonOptions.map(({ value, labelKey }) => ({
            value,
            label: t(labelKey),
          }))}
        />
      )}
    </StepScaffold>
  );
}
