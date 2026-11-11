import { useWatch } from "react-hook-form";

import { isSameDay } from "@/utils/calendar";

import { BirthDateMode, TogetherMode } from "../schema/companion.schema";
import { useCompanionStep } from "./use-companion-step";

type UseTimeTogetherStepArgs = {
  onNext: () => void;
};

export function useTimeTogetherStep({ onNext }: UseTimeTogetherStepArgs) {
  const { control, goNext, setValue } = useCompanionStep({
    fields: ["together"],
    onNext,
  });
  const birthDate = useWatch({ control, name: "birth.date" });
  const birthDateMode = useWatch({ control, name: "birth.mode" });

  const matchDateToMode = (mode: string) => {
    if (mode === TogetherMode.SINCE_BIRTH) {
      setValue("together.date", birthDate, { shouldValidate: true });
    }
  };

  const matchModeToDate = (date: Date) => {
    const mode = isSameDay(date, birthDate)
      ? TogetherMode.SINCE_BIRTH
      : TogetherMode.JOINED_LATER;

    setValue("together.mode", mode);
  };

  return {
    control,
    goNext,
    birthDate,
    isLockedToBirthDate: birthDateMode === BirthDateMode.EXACT,
    matchDateToMode,
    matchModeToDate,
  };
}
