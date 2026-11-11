import { QueryClient } from '@tanstack/react-query';

import { ApiError } from './api-error';

const MAX_QUERY_RETRIES = 2;
const UNAUTHORIZED_STATUS = 401;

const shouldRetryQuery = (failureCount: number, error: Error) =>
  !(error instanceof ApiError && error.status === UNAUTHORIZED_STATUS) &&
  failureCount < MAX_QUERY_RETRIES;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: shouldRetryQuery, staleTime: 60_000 },
    mutations: { retry: 0 },
  },
});
