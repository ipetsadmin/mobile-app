import { useTranslation } from 'react-i18next';

import type { AccountSection } from '../account-section';
import { useAccount } from '../data/use-account';
import { useLanguageSetting } from '../hooks/use-language-setting';
import { SettingsGroup } from './settings-group';
import { SettingsRow } from './settings-row';

const languageKeys = { en: 'account.languages.en', es: 'account.languages.es' } as const;

const HOUSEHOLD_SIZE = 1;

type AccountSettingsProps = {
  onOpen: (section: AccountSection) => void;
};

export function AccountSettings({ onOpen }: AccountSettingsProps) {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { language } = useLanguageSetting();

  return (
    <>
      <SettingsGroup label={t('account.groups.account')}>
        <SettingsRow label={t('account.rows.email')} value={account.email} />
        <SettingsRow label={t('account.rows.password')} onPress={() => onOpen('password')} />
        <SettingsRow
          label={t('account.rows.household')}
          value={t('account.people', { count: HOUSEHOLD_SIZE })}
          isLast
          onPress={() => onOpen('household')}
        />
      </SettingsGroup>
      <SettingsGroup label={t('account.groups.preferences')}>
        <SettingsRow
          label={t('account.rows.notifications')}
          value={t(account.notifications.push || account.notifications.email ? 'account.notificationPreferences.on' : 'account.notificationPreferences.off')}
          onPress={() => onOpen('notifications')}
        />
        <SettingsRow
          label={t('account.rows.language')}
          value={t(languageKeys[language])}
          isLast
          onPress={() => onOpen('language')}
        />
      </SettingsGroup>
    </>
  );
}
