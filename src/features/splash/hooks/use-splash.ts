import { use } from 'react';

import { SplashContext } from '../components/splash-provider';

export function useSplash() {
  return use(SplashContext);
}
