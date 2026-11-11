import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { AccountSettings } from '../components/account-settings';
import { AppearanceSetting } from '../components/appearance-setting';
import { ProfileCard } from '../components/profile-card';
import { useAccount } from '../data/use-account';
import type { AccountSection } from '../account-section';

type AccountScreenProps = {
  onOpen: (section: AccountSection) => void;
  onSignOut: () => void;
};

export function AccountScreen({ onOpen, onSignOut }: AccountScreenProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { account } = useAccount();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}>
      <ProfileCard
        name={account.name}
        email={account.email}
        photoUri={account.photoUri}
        onPress={() => onOpen('profile')}
      />
      <AppearanceSetting />
      <AccountSettings onOpen={onOpen} />
      <Button
        title={t('account.signOut')}
        variant="secondary"
        size="lg"
        icon={
          <SymbolView
            name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
            size={20}
            tintColor={theme.text}
          />
        }
        onPress={onSignOut}
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
