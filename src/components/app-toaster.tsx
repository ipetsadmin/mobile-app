import { Toaster } from 'sonner-native';

import { Radius, ThemeSchemes } from '@/constants/theme';
import { useTheme, useThemePreference } from '@/hooks/use-theme';

export function AppToaster() {
  const theme = useTheme();
  const { themeName } = useThemePreference();

  return (
    <Toaster
      theme={ThemeSchemes[themeName]}
      toastOptions={{
        style: {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          borderRadius: Radius.card,
          borderCurve: 'continuous',
        },
        titleStyle: { color: theme.text },
      }}
    />
  );
}
