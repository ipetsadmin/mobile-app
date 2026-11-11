import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { usePetAppointments } from '../data/use-pet-appointments';
import { splitAppointments } from '../utils/split-appointments';
import { AppointmentRow } from './appointment-row';

type NextAppointmentProps = {
  petId: string;
};

export function NextAppointment({ petId }: NextAppointmentProps) {
  const { t } = useTranslation();
  const { data = [] } = usePetAppointments(petId);
  const [next] = splitAppointments(data, new Date()).upcoming;

  if (!next) return null;

  return (
    <View style={styles.section}>
      <ThemedText type="label">{t('appointment.nextTitle')}</ThemedText>
      <AppointmentRow appointment={next} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.xs,
  },
});
