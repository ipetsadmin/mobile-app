import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { usePhotoPicker } from '@/hooks/use-photo-picker';

import { useAccount } from '../data/use-account';
import { useUpdateProfile } from '../data/use-update-profile';
import { useUploadAvatar } from '../data/use-upload-avatar';
import { editProfileSchema, type EditProfileValues } from '../schema/edit-profile.schema';

type UseEditProfileFormArgs = {
  onProfileSaved: () => void;
};

export function useEditProfileForm({ onProfileSaved }: UseEditProfileFormArgs) {
  const { t } = useTranslation();
  const { account } = useAccount();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const { control, handleSubmit, setValue, setFocus } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    values: {
      firstName: account.firstName,
      lastName: account.lastName,
      photoUri: account.photoUri,
    },
    resetOptions: { keepDirtyValues: true },
  });
  const photoPicker = usePhotoPicker({
    onPhotoPicked: (uri) => setValue('photoUri', uri, { shouldDirty: true }),
  });

  const showError = () => toast.error(t('account.profile.error'));

  const submit = handleSubmit((values) =>
    updateProfile.mutate(values, {
      onSuccess: () => {
        const hasNewPhoto = values.photoUri && values.photoUri !== account.photoUri;

        if (hasNewPhoto) {
          uploadAvatar.mutate(values.photoUri as string, {
            onSuccess: onProfileSaved,
            onError: () => toast.error(t('common.photoErrors.uploadFailed')),
          });
          return;
        }

        onProfileSaved();
      },
      onError: showError,
    }),
  );

  return {
    control,
    submit,
    photoPicker,
    isPending: updateProfile.isPending || uploadAvatar.isPending,
    focusLastName: () => setFocus('lastName'),
    firstName: useWatch({ control, name: 'firstName' }),
    photoUri: useWatch({ control, name: 'photoUri' }),
  };
}
