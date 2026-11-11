import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useState } from 'react';

export function usePullRefresh(queryKeys: QueryKey[]) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);

    try {
      await Promise.all(queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    } finally {
      setIsRefreshing(false);
    }
  };

  return { isRefreshing, onRefresh };
}
