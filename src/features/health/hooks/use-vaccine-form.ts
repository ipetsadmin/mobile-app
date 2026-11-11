import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useCreateVaccine } from '../data/use-create-vaccine';
import { vaccineSchema, type VaccineValues } from '../schema/vaccine.schema';

type UseVaccineFormArgs = {
  petId: string;
  onVaccineSaved: () => void;
};

export function useVaccineForm({ petId, onVaccineSaved }: UseVaccineFormArgs) {
  const { t } = useTranslation();
  const { control, handleSubmit, setFocus } = useForm<VaccineValues>({
    resolver: zodResolver(vaccineSchema),
    defaultValues: { name: '', administeredAt: new Date(), laboratory: '', lotNumber: '', notes: '' },
  });
  const { mutate, isPending } = useCreateVaccine(petId);

  return {
    control,
    isPending,
    setFocus,
    submit: handleSubmit((values) =>
      mutate(values, {
        onSuccess: onVaccineSaved,
        onError: () => toast.error(t('vaccine.error')),
      }),
    ),
  };
}
