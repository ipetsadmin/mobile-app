import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function useHeaderOptions() {
  const theme = useTheme();
  const base = {
    headerBackButtonDisplayMode: 'minimal',
    headerShadowVisible: false,
    headerTintColor: theme.text,
  } as const;

  return {
    standard: {
      ...base,
      headerStyle: { backgroundColor: theme.background },
      headerTitleStyle: { fontFamily: Fonts.bold, color: theme.text },
    },
    largeTitle: {
      ...base,
      headerLargeTitleEnabled: true,
      headerTransparent: true,
      headerBlurEffect: 'none',
      headerLargeTitleShadowVisible: false,
      headerLargeStyle: { backgroundColor: 'transparent' },
      headerTitleStyle: { fontFamily: Fonts.medium, color: theme.text },
      headerLargeTitleStyle: { fontFamily: Fonts.medium, color: theme.text },
    },
  } as const;
}
