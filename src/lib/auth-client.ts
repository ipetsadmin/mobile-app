import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const scheme = Constants.expoConfig?.scheme;

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  basePath: '/api/v1/auth',
  plugins: [
    expoClient({
      scheme: Array.isArray(scheme) ? scheme[0] : scheme,
      storagePrefix: 'truffa',
      storage: SecureStore,
    }),
  ],
});
