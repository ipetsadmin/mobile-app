import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { roundToSlot } from '@/utils/time-slots';

import { useCreateTreatment } from '../data/use-create-treatment';
import { treatmentSchema, type TreatmentValues } from '../schema/treatment.schema';

type UseTreatmentFormArgs = {
  petId: string;
  onTreatmentSaved: () => void;
};

export function useTreatmentForm({ petId, onTreatmentSaved }: UseTreatmentFormArgs) {
  const { t } = useTranslation();
  const { control, handleSubmit, setFocus } = useForm<TreatmentValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      name: '',
      dosage: '',
      startDate: roundToSlot(new Date(), 'floor'),
      frequencyHours: '',
      durationDays: '',
      instructions: '',
    },
  });
  const { mutate, isPending } = useCreateTreatment(petId);

  return {
    control,
    isPending,
    setFocus,
    submit: handleSubmit((values) =>
      mutate(values, {
        onSuccess: onTreatmentSaved,
        onError: () => toast.error(t('treatment.error')),
      }),
    ),
  };
}
