import { TreatmentType } from '@ipetsadmin/contracts';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { usePetTreatments } from '../data/use-pet-treatments';
import { isFinishedTreatment } from '../utils/treatment-status-keys';
import { TreatmentRow } from './treatment-row';

type TreatmentListProps = {
  petId: string;
};

export function TreatmentList({ petId }: TreatmentListProps) {
  const { t } = useTranslation();
  const { data = [] } = usePetTreatments(petId);
  const treatments = data
    .filter((treatment) => treatment.treatmentType !== TreatmentType.VACCINATION)
    .sort(
      (a, b) => Number(isFinishedTreatment(a.status)) - Number(isFinishedTreatment(b.status)),
    );

  return (
    <View style={styles.list}>
      <ThemedText type="label">{t('treatment.listTitle')}</ThemedText>
      {treatments.length === 0 && (
        <ThemedText type="body" themeColor="textSecondary" style={styles.empty}>
          {t('treatment.empty')}
        </ThemedText>
      )}
      {treatments.map((treatment) => (
        <TreatmentRow key={treatment.id} treatment={treatment} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.xs,
  },
  empty: {
    paddingVertical: Spacing.md,
  },
});
