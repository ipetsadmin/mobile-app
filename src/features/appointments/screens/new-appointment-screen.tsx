import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { DateField } from '@/components/form/date-field';
import { FormScrollView } from '@/components/form/form-scroll-view';
import { SelectField } from '@/components/form/select-field';
import { TimeField } from '@/components/form/time-field';
import { TextField } from '@/components/form/text-field';
import { ThemedView } from '@/components/themed-view';

import { useAppointmentForm } from '../hooks/use-appointment-form';
import { appointmentTypeKeys } from '../utils/appointment-type-keys';

type NewAppointmentScreenProps = {
  petId: string;
  onAppointmentSaved: () => void;
};

export function NewAppointmentScreen({ petId, onAppointmentSaved }: NewAppointmentScreenProps) {
  const { t } = useTranslation();
  const { control, submit, setFocus, isPending } = useAppointmentForm({
    petId,
    onAppointmentSaved,
  });
  const typeOptions = Object.entries(appointmentTypeKeys).map(([value, key]) => ({ value, label: t(key) }));

  return (
    <ThemedView style={styles.screen}>
      <FormScrollView>
        <SelectField
          control={control}
          name="appointmentType"
          label={t('appointment.type')}
          placeholder={t('appointment.typePlaceholder')}
          sheetTitle={t('appointment.typeSheetTitle')}
          emptyText={t('appointment.typeEmpty')}
          options={typeOptions}
        />
        <DateField
          control={control}
          name="scheduledAt"
          label={t('appointment.scheduledAt')}
          placeholder={t('appointment.scheduledAtPlaceholder')}
          minimumDate={new Date()}
          preserveTime
        />
        <TimeField
          control={control}
          name="scheduledAt"
          label={t('common.time.label')}
          placeholder={t('common.time.placeholder')}
          sheetTitle={t('common.time.sheetTitle')}
          emptyText={t('common.time.empty')}
        />
        <TextField
          control={control}
          name="providerName"
          label={t('appointment.provider')}
          placeholder={t('appointment.providerPlaceholder')}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('locationName')}
        />
        <TextField
          control={control}
          name="locationName"
          label={t('appointment.location')}
          placeholder={t('appointment.locationPlaceholder')}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('address')}
        />
        <TextField
          control={control}
          name="address"
          label={t('appointment.address')}
          placeholder={t('appointment.addressPlaceholder')}
          textContentType="streetAddressLine1"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('city')}
        />
        <TextField
          control={control}
          name="city"
          label={t('appointment.city')}
          placeholder={t('appointment.cityPlaceholder')}
          textContentType="addressCity"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('reason')}
        />
        <TextField
          control={control}
          name="reason"
          label={t('appointment.reason')}
          labelHint={t('appointment.optional')}
          placeholder={t('appointment.reasonPlaceholder')}
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <Button size="lg" title={t('appointment.submit')} loading={isPending} onPress={submit} />
      </FormScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
