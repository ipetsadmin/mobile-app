import { useTranslation } from 'react-i18next';

import { OptionList } from '../components/option-list';
import { useLanguageSetting } from '../hooks/use-language-setting';

export function LanguageScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageSetting();

  return (
    <OptionList
      label={t('account.rows.language')}
      value={language}
      onChange={setLanguage}
      options={[
        { value: 'en', label: t('account.languages.en') },
        { value: 'es', label: t('account.languages.es') },
      ]}
    />
  );
}
