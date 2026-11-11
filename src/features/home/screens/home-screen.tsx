import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusMessage } from '@/components/status-message';
import { queryKeys } from '@/constants/query-keys';
import { Spacing } from '@/constants/theme';
import { useAccount } from '@/features/account';
import { useAgenda } from '@/features/agenda';
import { usePushPrompt } from '@/features/notifications';
import { usePets } from '@/features/pets';
import { useSplash } from '@/features/splash';
import { usePullRefresh } from '@/hooks/use-pull-refresh';
import { useTheme } from '@/hooks/use-theme';

import { CareRecordCard } from '../components/care-record-card';
import { Greeting } from '../components/greeting';
import { HomeHeader } from '../components/home-header';
import { WeekSection } from '../components/week-section';

const WEEK_DAYS = 7;

type HomeScreenProps = {
  onOpenNotifications: () => void;
  onOpenCompanion: (petId: string) => void;
  onNewCompanion: () => void;
};

export function HomeScreen({
  onOpenNotifications,
  onOpenCompanion,
  onNewCompanion,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { account } = useAccount();
  const { data: pets = [], isError: hasPetsError } = usePets();
  const { isRefreshing, onRefresh } = usePullRefresh([
    queryKeys.pets.all,
    queryKeys.agenda.all,
    queryKeys.account.all,
  ]);
  const { data: agendaItems = [] } = useAgenda(WEEK_DAYS);
  const { isFinished: isSplashFinished } = useSplash();
  const featuredPet = pets.at(0);

  usePushPrompt({
    isEnabled: isSplashFinished && pets.length > 0,
    isEmailOn: account.notifications.email,
  });

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        process.env.EXPO_OS !== 'ios' && { paddingTop: insets.top + Spacing.lg },
      ]}>
      <HomeHeader onOpenNotifications={onOpenNotifications} />
      <Greeting name={account.name} companionCount={pets.length} />
      {hasPetsError && pets.length === 0 ? (
        <StatusMessage
          message={t('common.loadError')}
          actionLabel={t('common.retry')}
          onAction={onRefresh}
        />
      ) : featuredPet ? (
        <CareRecordCard
          title={t('home.careRecord.title', { name: featuredPet.name })}
          body={t('home.careRecord.body')}
          actionLabel={t('home.careRecord.action')}
          onPress={() => onOpenCompanion(featuredPet.id)}
        />
      ) : (
        <CareRecordCard
          title={t('home.firstCompanion.title')}
          body={t('home.firstCompanion.body')}
          actionLabel={t('home.firstCompanion.action')}
          onPress={onNewCompanion}
        />
      )}
      <WeekSection
        items={agendaItems}
        onOpenAll={onOpenNotifications}
        onOpenItem={onOpenCompanion}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.lg,
    padding: Spacing.lg,
  },
});
