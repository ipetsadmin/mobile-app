import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { apiClient, getSessionCookie } from "@/lib/api-client";
import { PHOTO_CONTENT_TYPE, uploadFile } from "@/lib/upload-file";

type UploadPetPhotoArgs = {
  petId: string;
  uri: string;
};

export function useUploadPetPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, uri }: UploadPetPhotoArgs) => {
      const cookie = await getSessionCookie();
      const prepared = await apiClient.pets.preparePhotoUpload(cookie, petId, {
        contentType: PHOTO_CONTENT_TYPE,
      });

      if (!prepared.data) throw new Error("Missing upload target");

      await uploadFile(prepared.data, uri);
      await apiClient.pets.confirmPhotoUpload(cookie, petId, {
        objectKey: prepared.data.objectKey,
      });
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.pets.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.agenda.all }),
      ]),
  });
}
