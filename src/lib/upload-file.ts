import type { PresignedUploadResponse } from '@ipetsadmin/contracts';

import { ApiError } from './api-error';

export const PHOTO_CONTENT_TYPE = 'image/jpeg';

export async function uploadFile(target: PresignedUploadResponse, uri: string) {
  const form = new FormData();

  Object.entries(target.fields).forEach(([name, value]) => form.append(name, value));
  form.append('file', { uri, name: 'photo.jpg', type: PHOTO_CONTENT_TYPE } as unknown as Blob);

  const response = await fetch(target.url, { method: 'POST', body: form });

  if (!response.ok) throw new ApiError(response.status, response.statusText);
}
