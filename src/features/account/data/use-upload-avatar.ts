import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { apiClient, getSessionCookie } from '@/lib/api-client';
import { PHOTO_CONTENT_TYPE, uploadFile } from '@/lib/upload-file';

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uri: string) => {
      const cookie = await getSessionCookie();
      const prepared = await apiClient.users.prepareAvatarUpload(cookie, {
        contentType: PHOTO_CONTENT_TYPE,
      });

      if (!prepared.data) throw new Error('Missing upload target');

      await uploadFile(prepared.data, uri);
      await apiClient.users.confirmAvatarUpload(cookie, { objectKey: prepared.data.objectKey });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.account.all }),
  });
}
