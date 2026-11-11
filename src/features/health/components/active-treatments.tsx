import { TreatmentType } from '@ipetsadmin/contracts';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { usePetTreatments } from '../data/use-pet-treatments';
import { isFinishedTreatment } from '../utils/treatment-status-keys';
import { TreatmentRow } from './treatment-row';

type ActiveTreatmentsProps = {
  petId: string;
};

export function ActiveTreatments({ petId }: ActiveTreatmentsProps) {
  const { t } = useTranslation();
  const { data = [] } = usePetTreatments(petId);
  const active = data.filter(
    (treatment) =>
      treatment.treatmentType !== TreatmentType.VACCINATION && !isFinishedTreatment(treatment.status),
  );

  if (active.length === 0) return null;

  return (
    <View style={styles.list}>
      <ThemedText type="label">{t('treatment.activeTitle')}</ThemedText>
      {active.map((treatment) => (
        <TreatmentRow key={treatment.id} treatment={treatment} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.xs,
  },
});
