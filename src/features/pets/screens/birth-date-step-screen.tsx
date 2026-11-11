import { useTranslation } from "react-i18next";

import { DateField } from "@/components/form/date-field";
import { OptionGroupField } from "@/components/form/option-group-field";

import { StepScaffold } from "../components/step-scaffold";
import { useBirthDateStep } from "../hooks/use-birth-date-step";
import { BirthDateMode } from "../schema/companion.schema";

type BirthDateStepScreenProps = {
  onNext: () => void;
};

export function BirthDateStepScreen({ onNext }: BirthDateStepScreenProps) {
  const { t } = useTranslation();
  const { control, goNext, earliestBirthDate, latestBirthDate } =
    useBirthDateStep({ onNext });

  return (
    <StepScaffold
      step={5}
      title={t("newCompanion.birthDate.title")}
      subtitle={t("newCompanion.birthDate.subtitle")}
      onNext={goNext}
    >
      <OptionGroupField
        control={control}
        name="birth.mode"
        label={t("newCompanion.birthDate.title")}
        layout="inline"
        options={[
          {
            value: BirthDateMode.EXACT,
            label: t("newCompanion.birthDate.exact"),
          },
          {
            value: BirthDateMode.UNSURE,
            label: t("newCompanion.birthDate.unsure"),
          },
        ]}
      />
      <DateField
        control={control}
        name="birth.date"
        label={t("newCompanion.birthDate.label")}
        placeholder={t("newCompanion.birthDate.placeholder")}
        minimumDate={earliestBirthDate}
        maximumDate={latestBirthDate}
      />
    </StepScaffold>
  );
}
