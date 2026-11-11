import { Image } from 'expo-image';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BrandMarkProps = {
  size?: number;
  tone?: ThemeColor;
};

export function BrandMark({ size = 48, tone = 'primary' }: BrandMarkProps) {
  const theme = useTheme();

  return (
    <Image
      source={require('@/assets/icons/logo.svg')}
      tintColor={theme[tone]}
      contentFit="contain"
      accessible={false}
      style={{ width: size, height: size }}
    />
  );
}
