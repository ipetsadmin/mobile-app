import { useEffect, useState } from "react";
import { useFormContext, type Path } from "react-hook-form";

import type { CompanionValues } from "../schema/companion.schema";

type UseCompanionStepArgs = {
  fields: Path<CompanionValues>[];
  onNext: () => void;
};

export function useCompanionStep({ fields, onNext }: UseCompanionStepArgs) {
  const { control, trigger, setValue, watch } =
    useFormContext<CompanionValues>();
  const [hasFailedNext, setHasFailedNext] = useState(false);

  useEffect(() => {
    if (!hasFailedNext) {
      return;
    }

    const subscription = watch((_values, { name }) => {
      const isStepField = fields.some(
        (field) => name === field || name?.startsWith(`${field}.`),
      );

      if (name && isStepField) {
        trigger(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [hasFailedNext, fields, watch, trigger]);

  const goNext = async () => {
    const isStepValid = await trigger(fields);

    if (isStepValid) {
      onNext();
      return;
    }

    setHasFailedNext(true);
  };

  return {
    control,
    goNext,
    setValue,
    clearField: (name: Path<CompanionValues>) =>
      setValue(name, undefined as never),
  };
}
