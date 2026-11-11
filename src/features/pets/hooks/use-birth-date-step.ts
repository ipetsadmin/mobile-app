import { useFormContext } from "react-hook-form";

import { subtractYears } from "@/utils/calendar";

import {
  BirthDateMode,
  MAX_PET_AGE_YEARS,
  TogetherMode,
  type CompanionValues,
} from "../schema/companion.schema";
import { useCompanionStep } from "./use-companion-step";

type UseBirthDateStepArgs = {
  onNext: () => void;
};

export function useBirthDateStep({ onNext }: UseBirthDateStepArgs) {
  const { getValues, setValue } = useFormContext<CompanionValues>();
  const today = new Date();

  const syncTimeTogether = () => {
    const birthDate = getValues("birth.date");
    const isSinceBirth =
      getValues("together.mode") === TogetherMode.SINCE_BIRTH;

    if (getValues("birth.mode") === BirthDateMode.EXACT || isSinceBirth) {
      setValue("together.mode", TogetherMode.SINCE_BIRTH);
      setValue("together.date", birthDate);
      return;
    }

    if (getValues("together.date") < birthDate) {
      setValue("together.date", birthDate);
    }
  };

  const { control, goNext } = useCompanionStep({
    fields: ["birth"],
    onNext: () => {
      syncTimeTogether();
      onNext();
    },
  });

  return {
    control,
    goNext,
    latestBirthDate: today,
    earliestBirthDate: subtractYears(today, MAX_PET_AGE_YEARS),
  };
}
