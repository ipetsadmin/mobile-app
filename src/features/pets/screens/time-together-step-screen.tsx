import { useTranslation } from "react-i18next";

import { DateField } from "@/components/form/date-field";
import { OptionGroupField } from "@/components/form/option-group-field";

import { StepScaffold } from "../components/step-scaffold";
import { useTimeTogetherStep } from "../hooks/use-time-together-step";
import { TogetherMode } from "../schema/companion.schema";

type TimeTogetherStepScreenProps = {
  onNext: () => void;
};

export function TimeTogetherStepScreen({
  onNext,
}: TimeTogetherStepScreenProps) {
  const { t } = useTranslation();
  const step = useTimeTogetherStep({ onNext });

  return (
    <StepScaffold
      step={5}
      title={t("newCompanion.timeTogether.title")}
      subtitle={t("newCompanion.timeTogether.subtitle")}
      onNext={step.goNext}
    >
      <OptionGroupField
        control={step.control}
        name="together.mode"
        label={t("newCompanion.timeTogether.title")}
        layout="inline"
        disabled={step.isLockedToBirthDate}
        onValueChange={step.matchDateToMode}
        options={[
          {
            value: TogetherMode.SINCE_BIRTH,
            label: t("newCompanion.timeTogether.sinceBirth"),
          },
          {
            value: TogetherMode.JOINED_LATER,
            label: t("newCompanion.timeTogether.joinedLater"),
          },
        ]}
      />
      <DateField
        control={step.control}
        name="together.date"
        label={t("newCompanion.timeTogether.label")}
        placeholder={t("newCompanion.timeTogether.placeholder")}
        minimumDate={step.birthDate}
        maximumDate={new Date()}
        disabled={step.isLockedToBirthDate}
        onValueChange={step.matchModeToDate}
      />
    </StepScaffold>
  );
}
