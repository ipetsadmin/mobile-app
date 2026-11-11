import { Geom_400Regular } from '@expo-google-fonts/geom/400Regular';
import { Geom_500Medium } from '@expo-google-fonts/geom/500Medium';
import { Geom_600SemiBold } from '@expo-google-fonts/geom/600SemiBold';
import { Geom_700Bold } from '@expo-google-fonts/geom/700Bold';
import { IosevkaCharon_400Regular } from '@expo-google-fonts/iosevka-charon/400Regular';
import { IosevkaCharon_500Medium } from '@expo-google-fonts/iosevka-charon/500Medium';
import { PlaywriteNZBasic_400Regular } from '@expo-google-fonts/playwrite-nz-basic/400Regular';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { SplashOverlay, SplashProvider, useAppBootstrap } from '@/features/splash';
import '@/lib/i18n';
import { AppToaster } from '@/components/app-toaster';
import { AppProviders } from '@/providers/app-providers';
import { Fonts } from '@/constants/theme';
import { useStoredPreferences } from '@/hooks/use-stored-preferences';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    [Fonts.regular]: Geom_400Regular,
    [Fonts.medium]: Geom_500Medium,
    [Fonts.semiBold]: Geom_600SemiBold,
    [Fonts.bold]: Geom_700Bold,
    [Fonts.secondary]: IosevkaCharon_400Regular,
    [Fonts.secondaryMedium]: IosevkaCharon_500Medium,
    [Fonts.accent]: PlaywriteNZBasic_400Regular,
  });
  const { themePreference } = useStoredPreferences();
  const areFontsSettled = (fontsLoaded || !!fontsError) && themePreference !== undefined;

  useEffect(() => {
    if (areFontsSettled) {
      SplashScreen.hideAsync();
    }
  }, [areFontsSettled]);

  if (!areFontsSettled) return null;

  return (
    <AppProviders themePreference={themePreference ?? 'system'}>
      <SplashProvider>
        <RootStack areFontsSettled={areFontsSettled} />
      </SplashProvider>
      <AppToaster />
    </AppProviders>
  );
}

type RootStackProps = {
  areFontsSettled: boolean;
};

function RootStack({ areFontsSettled }: RootStackProps) {
  const { hasSession, isReady } = useAppBootstrap(areFontsSettled);

  return (
    <View style={styles.root}>
      {isReady && (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!hasSession}>
            <Stack.Screen name="(public)" />
          </Stack.Protected>
          <Stack.Protected guard={hasSession}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
        </Stack>
      )}
      <SplashOverlay isReady={isReady} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
