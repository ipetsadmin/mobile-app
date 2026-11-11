import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { DateField } from '@/components/form/date-field';
import { FormScrollView } from '@/components/form/form-scroll-view';
import { TextField } from '@/components/form/text-field';
import { ThemedView } from '@/components/themed-view';

import { useVaccineForm } from '../hooks/use-vaccine-form';

type NewVaccineScreenProps = {
  petId: string;
  onVaccineSaved: () => void;
};

export function NewVaccineScreen({ petId, onVaccineSaved }: NewVaccineScreenProps) {
  const { t } = useTranslation();
  const { control, submit, setFocus, isPending } = useVaccineForm({
    petId,
    onVaccineSaved,
  });

  return (
    <ThemedView style={styles.screen}>
      <FormScrollView>
        <TextField
          control={control}
          name="name"
          label={t('vaccine.name')}
          placeholder={t('vaccine.namePlaceholder')}
          autoCapitalize="sentences"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('laboratory')}
        />
        <DateField
          control={control}
          name="administeredAt"
          label={t('vaccine.administeredAt')}
          placeholder={t('vaccine.administeredAtPlaceholder')}
          maximumDate={new Date()}
        />
        <TextField
          control={control}
          name="laboratory"
          label={t('vaccine.laboratory')}
          labelHint={t('vaccine.optional')}
          placeholder={t('vaccine.laboratoryPlaceholder')}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('lotNumber')}
        />
        <TextField
          control={control}
          name="lotNumber"
          label={t('vaccine.lotNumber')}
          labelHint={t('vaccine.optional')}
          placeholder={t('vaccine.lotNumberPlaceholder')}
          autoCapitalize="characters"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => setFocus('notes')}
        />
        <TextField
          control={control}
          name="notes"
          label={t('vaccine.notes')}
          labelHint={t('vaccine.optional')}
          placeholder={t('vaccine.notesPlaceholder')}
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <Button size="lg" title={t('vaccine.submit')} loading={isPending} onPress={submit} />
      </FormScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
