import { Gender } from "@ipetsadmin/contracts";
import { useTranslation } from "react-i18next";

import { OptionGroupField } from "@/components/form/option-group-field";

import { StepScaffold } from "../components/step-scaffold";
import { useCompanionStep } from "../hooks/use-companion-step";

type SexStepScreenProps = {
  onNext: () => void;
};

export function SexStepScreen({ onNext }: SexStepScreenProps) {
  const { t } = useTranslation();
  const { control, goNext } = useCompanionStep({ fields: ["gender"], onNext });

  return (
    <StepScaffold
      step={4}
      title={t("newCompanion.sex.title")}
      subtitle={t("newCompanion.sex.subtitle")}
      onNext={goNext}
    >
      <OptionGroupField
        control={control}
        name="gender"
        label={t("newCompanion.sex.title")}
        layout="grid"
        options={[
          { value: Gender.FEMALE, label: t("gender.female") },
          { value: Gender.MALE, label: t("gender.male") },
        ]}
      />
    </StepScaffold>
  );
}
