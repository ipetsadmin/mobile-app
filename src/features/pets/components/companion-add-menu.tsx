import { useTranslation } from 'react-i18next';

import { FloatingActionMenu, type FloatingAction } from '@/components/floating-action-menu';

import type { CompanionTab } from '../utils/companion-tab';

type CompanionAddMenuProps = {
  tab: CompanionTab;
  onAddVaccine: () => void;
  onAddAppointment: () => void;
  onAddTreatment: () => void;
};

export function CompanionAddMenu({
  tab,
  onAddVaccine,
  onAddAppointment,
  onAddTreatment,
}: CompanionAddMenuProps) {
  const { t } = useTranslation();

  const actions = {
    vaccine: {
      key: 'vaccine',
      label: t('vaccine.add'),
      icon: { ios: 'syringe', android: 'vaccines', web: 'vaccines' },
      onPress: onAddVaccine,
    },
    treatment: {
      key: 'treatment',
      label: t('treatment.add'),
      icon: { ios: 'pills', android: 'medication', web: 'medication' },
      onPress: onAddTreatment,
    },
    appointment: {
      key: 'appointment',
      label: t('appointment.add'),
      icon: { ios: 'calendar.badge.plus', android: 'event', web: 'event' },
      onPress: onAddAppointment,
    },
  } satisfies Record<string, FloatingAction>;

  const actionsByTab = {
    overview: [actions.vaccine, actions.treatment, actions.appointment],
    health: [actions.vaccine, actions.treatment],
    appointments: [actions.appointment],
  };

  return <FloatingActionMenu label={t('addMenu.open')} actions={actionsByTab[tab]} />;
}
