import { Species } from "@ipetsadmin/contracts";
import { useTranslation } from "react-i18next";

import { OptionGroupField } from "@/components/form/option-group-field";

import { SpeciesIcon } from "../components/species-icon";
import { StepScaffold } from "../components/step-scaffold";
import { useCompanionStep } from "../hooks/use-companion-step";

type PetTypeStepScreenProps = {
  onNext: () => void;
};

export function PetTypeStepScreen({ onNext }: PetTypeStepScreenProps) {
  const { t } = useTranslation();
  const { control, goNext, clearField } = useCompanionStep({
    fields: ["species"],
    onNext,
  });

  return (
    <StepScaffold
      step={1}
      title={t("newCompanion.petType.title")}
      subtitle={t("newCompanion.petType.subtitle")}
      onNext={goNext}
    >
      <OptionGroupField
        control={control}
        name="species"
        label={t("newCompanion.petType.title")}
        onValueChange={() => clearField("breed")}
        options={[
          {
            value: Species.DOG,
            label: t("species.dog"),
            icon: <SpeciesIcon species={Species.DOG} />,
          },
          {
            value: Species.CAT,
            label: t("species.cat"),
            icon: <SpeciesIcon species={Species.CAT} />,
          },
        ]}
      />
    </StepScaffold>
  );
}
