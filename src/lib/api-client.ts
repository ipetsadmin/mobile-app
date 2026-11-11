import { createApiClient, type HttpClient } from '@ipetsadmin/api-client';

import { ApiError } from './api-error';
import { authClient } from './auth-client';
import { queryClient } from './query-client';

type RequestConfig = { headers?: Record<string, string> };

const UNAUTHORIZED_STATUS = 401;
const REQUEST_TIMEOUT_MS = 20_000;
const TIMEOUT_STATUS = 0;

let isEndingSession = false;

async function endSession() {
  if (isEndingSession) return;

  isEndingSession = true;

  try {
    await authClient.signOut();
  } finally {
    queryClient.clear();
    isEndingSession = false;
  }
}

function parseBody(text: string) {
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

async function request<TResponse>(
  method: string,
  url: string,
  body?: unknown,
  config?: unknown,
): Promise<{ data: TResponse }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config as RequestConfig)?.headers,
  };

  let response: Response;
  let text: string;

  try {
    response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${url}`, {
      method,
      credentials: 'omit',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    text = await response.text();
  } catch (error) {
    if (controller.signal.aborted) throw new ApiError(TIMEOUT_STATUS, 'REQUEST_TIMEOUT');

    throw error;
  } finally {
    clearTimeout(timer);
  }

  const data = parseBody(text);

  if (response.status === UNAUTHORIZED_STATUS && headers.Cookie) await endSession();

  if (!response.ok) throw new ApiError(response.status, data?.message ?? response.statusText);

  return { data };
}

const http: HttpClient = {
  get: (url, config) => request('GET', url, undefined, config),
  post: (url, body, config) => request('POST', url, body, config),
  patch: (url, body, config) => request('PATCH', url, body, config),
  put: (url, body, config) => request('PUT', url, body, config),
  delete: (url, config) => request('DELETE', url, undefined, config),
};

export const apiClient = createApiClient({ http });

export const getSessionCookie = () => authClient.getCookie();
