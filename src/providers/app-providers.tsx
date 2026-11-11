import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import type { ThemePreference } from '@/constants/theme';
import { queryClient } from '@/lib/query-client';

import { AppThemeProvider } from './theme-provider';

type AppProvidersProps = PropsWithChildren<{
  themePreference: ThemePreference;
}>;

export function AppProviders({ themePreference, children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <AppThemeProvider initialPreference={themePreference}>{children}</AppThemeProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
