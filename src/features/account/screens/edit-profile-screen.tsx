import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { FormScrollView } from '@/components/form/form-scroll-view';
import { ThemedView } from '@/components/themed-view';

import { ProfileNameFields } from '../components/profile-name-fields';
import { ProfilePhotoButton } from '../components/profile-photo-button';
import { useEditProfileForm } from '../hooks/use-edit-profile-form';

type EditProfileScreenProps = {
  onProfileSaved: () => void;
};

export function EditProfileScreen({ onProfileSaved }: EditProfileScreenProps) {
  const { t } = useTranslation();
  const { control, submit, photoPicker, firstName, photoUri, focusLastName, isPending } =
    useEditProfileForm({ onProfileSaved });

  const showPhotoOptions = () =>
    Alert.alert(t('account.profile.photoOptions'), undefined, [
      { text: t('account.profile.takePhoto'), onPress: photoPicker.takePhoto },
      { text: t('account.profile.chooseFromLibrary'), onPress: photoPicker.chooseFromLibrary },
      { text: t('common.cancel'), style: 'cancel' },
    ]);

  return (
    <ThemedView style={styles.screen}>
      <FormScrollView>
        <ProfilePhotoButton
          name={firstName}
          photoUri={photoUri}
          label={t('account.profile.photoOptions')}
          onPress={showPhotoOptions}
        />
        <ProfileNameFields control={control} onFocusLastName={focusLastName} onSubmit={submit} />
        <Button
          size="lg"
          title={t('account.profile.submit')}
          loading={isPending}
          onPress={submit}
        />
      </FormScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
