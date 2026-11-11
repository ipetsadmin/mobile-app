import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  type ImagePickerOptions,
  type ImagePickerResult,
} from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

type UsePhotoPickerArgs = {
  onPhotoPicked: (uri: string) => void;
};

const pickerOptions: ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

export function usePhotoPicker({ onPhotoPicked }: UsePhotoPickerArgs) {
  const { t } = useTranslation();

  const handleResult = (result: ImagePickerResult) => {
    if (!result.canceled) {
      onPhotoPicked(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await requestCameraPermissionsAsync();

    if (!permission.granted) {
      toast.error(t('common.photoErrors.cameraPermissionDenied'));
      return;
    }

    try {
      handleResult(await launchCameraAsync(pickerOptions));
    } catch {
      toast.error(t('common.photoErrors.cameraUnavailable'));
    }
  };

  const chooseFromLibrary = async () => {
    try {
      handleResult(await launchImageLibraryAsync(pickerOptions));
    } catch {
      toast.error(t('common.photoErrors.libraryUnavailable'));
    }
  };

  return { takePhoto, chooseFromLibrary };
}
