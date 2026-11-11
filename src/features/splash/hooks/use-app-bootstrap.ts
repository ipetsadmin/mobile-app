import { useEffect, useState } from 'react';

import { useAuthSession } from '@/features/auth';
import { usePets } from '@/features/pets';

const BOOTSTRAP_TIMEOUT_MS = 4000;

export function useAppBootstrap(areFontsSettled: boolean) {
  const { session, isPending: isSessionPending } = useAuthSession();
  const { isPending: arePetsPending } = usePets();
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  const hasSession = session != null;

  useEffect(() => {
    const timer = setTimeout(() => setHasTimedOut(true), BOOTSTRAP_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, []);

  const isDataReady = !isSessionPending && (!hasSession || !arePetsPending);

  if (!hasBooted && areFontsSettled && (isDataReady || hasTimedOut)) {
    setHasBooted(true);
  }

  return { hasSession, isReady: hasBooted };
}
