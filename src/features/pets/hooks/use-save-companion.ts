import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useCreatePet } from '../data/use-create-pet';
import { useUpdatePet } from '../data/use-update-pet';
import { useUploadPetPhoto } from '../data/use-upload-pet-photo';
import type { CompanionValues } from '../schema/companion.schema';

type UseSaveCompanionArgs = {
  petId?: string;
  onSaved: () => void;
};

const isLocalPhoto = (uri?: string): uri is string => !!uri && !uri.startsWith('http');

export function useSaveCompanion({ petId, onSaved }: UseSaveCompanionArgs) {
  const { t } = useTranslation();
  const { getValues } = useFormContext<CompanionValues>();
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const uploadPhoto = useUploadPetPhoto();
  const save = petId ? updatePet : createPet;
  const showError = () => toast.error(t(petId ? 'editCompanion.error' : 'newCompanion.createError'));

  const showPhotoError = () => toast.error(t('common.photoErrors.uploadFailed'));

  const finish = (savedPetId: string, photoUri?: string) => {
    if (isLocalPhoto(photoUri)) {
      uploadPhoto.mutate(
        { petId: savedPetId, uri: photoUri },
        { onSuccess: onSaved, onError: showPhotoError },
      );
      return;
    }

    onSaved();
  };

  const submit = () => {
    const values = getValues();

    if (petId) {
      updatePet.mutate(
        { petId, values },
        { onSuccess: () => finish(petId, values.photoUri), onError: showError },
      );
      return;
    }

    if (createPet.data) {
      finish(createPet.data.id, values.photoUri);
      return;
    }

    createPet.mutate(values, {
      onSuccess: (pet) => finish(pet.id, values.photoUri),
      onError: showError,
    });
  };

  return {
    submit,
    isPending: save.isPending || uploadPhoto.isPending,
  };
}
