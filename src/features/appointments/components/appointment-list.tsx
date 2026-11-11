import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { usePetAppointments } from '../data/use-pet-appointments';
import { splitAppointments } from '../utils/split-appointments';
import { AppointmentRow } from './appointment-row';

type AppointmentListProps = {
  petId: string;
};

export function AppointmentList({ petId }: AppointmentListProps) {
  const { t } = useTranslation();
  const { data: appointments = [], isPending, isError, refetch } = usePetAppointments(petId);
  const { upcoming, past } = splitAppointments(appointments, new Date());

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

  if (appointments.length === 0) {
    return (
      <ThemedText type="body" themeColor="textSecondary" style={styles.empty}>
        {t('appointment.empty')}
      </ThemedText>
    );
  }

  return (
    <View style={styles.sections}>
      {upcoming.length > 0 && (
        <View style={styles.list}>
          <ThemedText type="label">{t('appointment.upcomingTitle')}</ThemedText>
          {upcoming.map((appointment) => (
            <AppointmentRow key={appointment.id} appointment={appointment} />
          ))}
        </View>
      )}
      {past.length > 0 && (
        <View style={styles.list}>
          <ThemedText type="label">{t('appointment.pastTitle')}</ThemedText>
          {past.map((appointment) => (
            <AppointmentRow key={appointment.id} appointment={appointment} isMuted />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sections: {
    gap: Spacing.lg,
  },
  list: {
    gap: Spacing.xs,
  },
  empty: {
    paddingVertical: Spacing.lg,
    textAlign: 'center',
  },
});
