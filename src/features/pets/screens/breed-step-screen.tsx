import { useTranslation } from "react-i18next";

import { SelectField } from "@/components/form/select-field";

import { StepScaffold } from "../components/step-scaffold";
import { useBreedOptions } from "../hooks/use-breed-options";
import { useCompanionStep } from "../hooks/use-companion-step";

type BreedStepScreenProps = {
  onNext: () => void;
};

export function BreedStepScreen({ onNext }: BreedStepScreenProps) {
  const { t } = useTranslation();
  const { control, goNext } = useCompanionStep({ fields: ["breed"], onNext });
  const breedOptions = useBreedOptions();

  return (
    <StepScaffold
      step={3}
      title={t("newCompanion.breed.title")}
      subtitle={t("newCompanion.breed.subtitle")}
      onNext={goNext}
    >
      <SelectField
        control={control}
        name="breed"
        label={t("newCompanion.breed.label")}
        placeholder={t("newCompanion.breed.placeholder")}
        options={breedOptions}
        sheetTitle={t("newCompanion.breed.sheetTitle")}
        searchPlaceholder={t("newCompanion.breed.searchPlaceholder")}
        emptyText={t("newCompanion.breed.empty")}
      />
    </StepScaffold>
  );
}
