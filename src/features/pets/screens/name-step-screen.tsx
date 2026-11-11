import { useTranslation } from "react-i18next";

import { TextField } from "@/components/form/text-field";

import { StepScaffold } from "../components/step-scaffold";
import { useCompanionStep } from "../hooks/use-companion-step";

type NameStepScreenProps = {
  onNext: () => void;
};

export function NameStepScreen({ onNext }: NameStepScreenProps) {
  const { t } = useTranslation();
  const { control, goNext } = useCompanionStep({ fields: ["name"], onNext });

  return (
    <StepScaffold
      step={2}
      title={t("newCompanion.name.title")}
      subtitle={t("newCompanion.name.subtitle")}
      onNext={goNext}
    >
      <TextField
        control={control}
        name="name"
        label={t("newCompanion.name.label")}
        labelHint={t("newCompanion.name.hint")}
        placeholder={t("newCompanion.name.placeholder")}
        autoCapitalize="words"
        autoCorrect={false}
        autoFocus
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={goNext}
      />
    </StepScaffold>
  );
}
