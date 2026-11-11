import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useEffect, useState, type PropsWithChildren } from 'react';
import { Appearance } from 'react-native';

import { Themes, ThemeSchemes, type ThemeName, type ThemePreference } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { saveThemePreference } from '@/lib/theme-storage';

type ThemeContextValue = {
  themeName: ThemeName;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  themeName: 'light',
  preference: 'system',
  setPreference: () => {},
});

type AppThemeProviderProps = PropsWithChildren<{
  initialPreference: ThemePreference;
}>;

export function AppThemeProvider({ initialPreference, children }: AppThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);

  const updatePreference = (next: ThemePreference) => {
    setPreference(next);
    saveThemePreference(next).catch(() => {});
  };

  const themeName =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
  const colors = Themes[themeName];
  const scheme = ThemeSchemes[themeName];
  const baseNavigationTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    if (process.env.EXPO_OS !== 'web') {
      Appearance.setColorScheme(preference === 'system' ? 'unspecified' : ThemeSchemes[preference]);
    }
  }, [preference]);

  return (
    <ThemeContext value={{ themeName, preference, setPreference: updatePreference }}>
      <ThemeProvider
        value={{
          ...baseNavigationTheme,
          colors: {
            ...baseNavigationTheme.colors,
            primary: colors.primary,
            background: colors.background,
            card: colors.backgroundElement,
            text: colors.text,
            border: colors.backgroundSelected,
            notification: colors.accent,
          },
        }}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        {children}
      </ThemeProvider>
    </ThemeContext>
  );
}
