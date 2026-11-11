import { type TextStyle } from 'react-native';

const brand = {
  marfil: '#EDE7DC',
  azulNoche: '#171C2F',
  pizarra: '#46536E',
  borgona: '#602D38',
  azulNiebla: '#C4CED8',
  bermellon: '#E53322',
} as const;

export const Themes = {
  light: {
    text: brand.azulNoche,
    textSecondary: brand.pizarra,
    background: brand.marfil,
    backgroundElement: '#F7F4EE',
    backgroundField: '#F7F4EE',
    backgroundSelected: '#E3DDD0',
    border: '#DDD6C8',
    muted: '#C4CED8',
    glow: 'rgba(70, 83, 110, 0.12)',
    pattern: 'rgba(70, 83, 110, 0.08)',
    primary: brand.pizarra,
    primarySubdued: brand.pizarra,
    onPrimary: brand.marfil,
    secondary: brand.borgona,
    onSecondary: brand.marfil,
    accent: brand.bermellon,
    onAccent: brand.marfil,
  },
  dark: {
    text: brand.marfil,
    textSecondary: '#9099A5',
    background: brand.azulNoche,
    backgroundElement: '#1F2438',
    backgroundField: '#232739',
    backgroundSelected: '#2B3045',
    border: '#2E3449',
    muted: '#46536E',
    glow: 'rgba(196, 206, 216, 0.10)',
    pattern: 'rgba(23, 28, 47, 0.35)',
    primary: brand.azulNiebla,
    primarySubdued: '#333D56',
    onPrimary: brand.azulNoche,
    secondary: brand.pizarra,
    onSecondary: brand.marfil,
    accent: brand.bermellon,
    onAccent: brand.marfil,
  },
  exploratory: {
    text: brand.marfil,
    textSecondary: '#C3AFAB',
    background: brand.borgona,
    backgroundElement: '#542831',
    backgroundField: '#683843',
    backgroundSelected: '#703F4A',
    border: '#74434E',
    muted: '#8E5F69',
    glow: 'rgba(237, 231, 220, 0.10)',
    pattern: 'rgba(96, 45, 56, 0.35)',
    primary: brand.marfil,
    primarySubdued: '#6B3A46',
    onPrimary: brand.borgona,
    secondary: brand.azulNiebla,
    onSecondary: brand.azulNoche,
    accent: brand.bermellon,
    onAccent: brand.marfil,
  },
} as const;

export type ThemeName = keyof typeof Themes;
export type ThemePreference = ThemeName | 'system';

export const ThemeNames = Object.keys(Themes) as ThemeName[];
export type ThemeColor = keyof (typeof Themes)[ThemeName];

export const ThemeSchemes = {
  light: 'light',
  dark: 'dark',
  exploratory: 'dark',
} as const satisfies Record<ThemeName, 'light' | 'dark'>;

export const Spacing = {
  '2xs': 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Radius = {
  control: 14,
  card: 20,
  device: 46,
  pill: 999,
} as const;

const fontFamily = (postScriptName: string, fileName: string) =>
  process.env.EXPO_OS === 'ios' ? postScriptName : fileName;

export const Fonts = {
  regular: fontFamily('Geom-Regular', 'Geom_400Regular'),
  medium: fontFamily('Geom-Medium', 'Geom_500Medium'),
  semiBold: fontFamily('Geom-SemiBold', 'Geom_600SemiBold'),
  bold: fontFamily('Geom-Bold', 'Geom_700Bold'),
  secondary: fontFamily('IosevkaCharon-Regular', 'IosevkaCharon_400Regular'),
  secondaryMedium: fontFamily('IosevkaCharon-Medium', 'IosevkaCharon_500Medium'),
  accent: fontFamily('PlaywriteNZBasic-Regular', 'PlaywriteNZBasic_400Regular'),
};

export const Typography = {
  display: { fontFamily: Fonts.medium, fontSize: 40, lineHeight: 48 },
  title: { fontFamily: Fonts.medium, fontSize: 34, lineHeight: 40 },
  titleSmall: { fontFamily: Fonts.medium, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: Fonts.bold, fontSize: 24, lineHeight: 32 },
  subheading: { fontFamily: Fonts.medium, fontSize: 20, lineHeight: 28 },
  body: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: Fonts.bold, fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 20 },
  button: { fontFamily: Fonts.medium, fontSize: 16, lineHeight: 24 },
  label: {
    fontFamily: Fonts.secondary,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  navigation: {
    fontFamily: Fonts.secondaryMedium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  accent: { fontFamily: Fonts.accent, fontSize: 22, lineHeight: 36 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof Typography;

export const Shadows = {
  card: '0 1px 2px rgba(0, 0, 0, 0.05)',
  raised: '0 4px 12px rgba(0, 0, 0, 0.10)',
  overlay: '0 8px 24px rgba(0, 0, 0, 0.18)',
} as const;

export const Motion = {
  fast: 150,
  base: 250,
  slow: 400,
  introMorph: 450,
  introHold: 200,
  introLogoHold: 300,
  introExit: 650,
} as const;
