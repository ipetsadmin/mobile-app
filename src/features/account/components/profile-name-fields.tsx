import type { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { TextField } from '@/components/form/text-field';
import { Spacing } from '@/constants/theme';

import type { EditProfileValues } from '../schema/edit-profile.schema';

type ProfileNameFieldsProps = {
  control: Control<EditProfileValues>;
  onFocusLastName: () => void;
  onSubmit: () => void;
};

export function ProfileNameFields({ control, onFocusLastName, onSubmit }: ProfileNameFieldsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.names}>
      <TextField
        control={control}
        name="firstName"
        label={t('account.profile.firstName')}
        placeholder={t('account.profile.firstNamePlaceholder')}
        style={styles.field}
        autoCapitalize="words"
        autoCorrect={false}
        textContentType="givenName"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={onFocusLastName}
      />
      <TextField
        control={control}
        name="lastName"
        label={t('account.profile.lastName')}
        placeholder={t('account.profile.lastNamePlaceholder')}
        style={styles.field}
        autoCapitalize="words"
        autoCorrect={false}
        textContentType="familyName"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  names: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  field: {
    flex: 1,
  },
});
