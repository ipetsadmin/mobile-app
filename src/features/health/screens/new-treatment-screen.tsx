import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { DateField } from '@/components/form/date-field';
import { FormScrollView } from '@/components/form/form-scroll-view';
import { SelectField } from '@/components/form/select-field';
import { TimeField } from '@/components/form/time-field';
import { TextField } from '@/components/form/text-field';
import { ThemedView } from '@/components/themed-view';

import { useTreatmentForm } from '../hooks/use-treatment-form';
import { selectableTreatmentTypes, treatmentTypeKeys } from '../utils/treatment-type-keys';

type NewTreatmentScreenProps = {
  petId: string;
  onTreatmentSaved: () => void;
};

export function NewTreatmentScreen({ petId, onTreatmentSaved }: NewTreatmentScreenProps) {
  const { t } = useTranslation();
  const { control, submit, setFocus, isPending } = useTreatmentForm({ petId, onTreatmentSaved });
  const typeOptions = selectableTreatmentTypes.map((value) => ({
    value,
    label: t(treatmentTypeKeys[value]),
  }));

  return (
    <ThemedView style={styles.screen}>
      <FormScrollView>
        <SelectField
          control={control}
          name="treatmentType"
          label={t('treatment.type')}
          placeholder={t('treatment.typePlaceholder')}
          sheetTitle={t('treatment.typeSheetTitle')}
          emptyText={t('treatment.typeEmpty')}
          options={typeOptions}
        />
        <TextField
          control={control}
          name="name"
          label={t('treatment.name')}
          placeholder={t('treatment.namePlaceholder')}
          autoCapitalize="sentences"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('dosage')}
        />
        <TextField
          control={control}
          name="dosage"
          label={t('treatment.dosage')}
          placeholder={t('treatment.dosagePlaceholder')}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('frequencyHours')}
        />
        <DateField
          control={control}
          name="startDate"
          label={t('treatment.startDate')}
          placeholder={t('treatment.startDatePlaceholder')}
          preserveTime
        />
        <TimeField
          control={control}
          name="startDate"
          label={t('common.time.label')}
          placeholder={t('common.time.placeholder')}
          sheetTitle={t('common.time.sheetTitle')}
          emptyText={t('common.time.empty')}
        />
        <TextField
          control={control}
          name="frequencyHours"
          label={t('treatment.frequencyHours')}
          placeholder={t('treatment.frequencyHoursPlaceholder')}
          keyboardType="number-pad"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('durationDays')}
        />
        <TextField
          control={control}
          name="durationDays"
          label={t('treatment.durationDays')}
          placeholder={t('treatment.durationDaysPlaceholder')}
          keyboardType="number-pad"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('instructions')}
        />
        <TextField
          control={control}
          name="instructions"
          label={t('treatment.instructions')}
          labelHint={t('treatment.optional')}
          placeholder={t('treatment.instructionsPlaceholder')}
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <Button size="lg" title={t('treatment.submit')} loading={isPending} onPress={submit} />
      </FormScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
