import { TreatmentType } from '@ipetsadmin/contracts';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { RecordRow } from '@/components/record-row';
import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { formatMediumDate } from '@/utils/format-date';

import { usePetTreatments } from '../data/use-pet-treatments';

type VaccineListProps = {
  petId: string;
};

function getTime(date?: Date) {
  return date ? new Date(date).getTime() : 0;
}

export function VaccineList({ petId }: VaccineListProps) {
  const { t, i18n } = useTranslation();
  const { data, isPending, isError, refetch } = usePetTreatments(petId);
  const vaccines = (data ?? [])
    .filter((treatment) => treatment.treatmentType === TreatmentType.VACCINATION)
    .sort((a, b) => getTime(b.startDate) - getTime(a.startDate));

  if (isPending) return <StatusMessage />;

  if (isError) {
    return (
      <StatusMessage
        message={t('common.loadError')}
        actionLabel={t('common.retry')}
        onAction={refetch}
      />
    );
  }

  return (
    <View style={styles.list}>
      <ThemedText type="label">{t('vaccine.listTitle')}</ThemedText>
      {vaccines.length === 0 && (
        <ThemedText type="body" themeColor="textSecondary" style={styles.empty}>
          {t('vaccine.empty')}
        </ThemedText>
      )}
      {vaccines.map((vaccine) => (
        <RecordRow
          key={vaccine.id}
          title={vaccine.medicationName}
          subtitle={
            vaccine.startDate
              ? formatMediumDate(new Date(vaccine.startDate), i18n.language)
              : undefined
          }
        />
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
