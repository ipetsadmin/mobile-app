import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { roundToSlot } from '@/utils/time-slots';

import { useCreateAppointment } from '../data/use-create-appointment';
import { appointmentSchema, type AppointmentValues } from '../schema/appointment.schema';

type UseAppointmentFormArgs = {
  petId: string;
  onAppointmentSaved: () => void;
};

export function useAppointmentForm({ petId, onAppointmentSaved }: UseAppointmentFormArgs) {
  const { t } = useTranslation();
  const { control, handleSubmit, setFocus } = useForm<AppointmentValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      scheduledAt: roundToSlot(new Date(), 'ceil'),
      providerName: '',
      locationName: '',
      address: '',
      city: '',
      reason: '',
    },
  });
  const { mutate, isPending } = useCreateAppointment(petId);

  return {
    control,
    isPending,
    setFocus,
    submit: handleSubmit((values) =>
      mutate(values, {
        onSuccess: onAppointmentSaved,
        onError: () => toast.error(t('appointment.error')),
      }),
    ),
  };
}
