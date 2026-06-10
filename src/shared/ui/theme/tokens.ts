import { Platform, type ColorSchemeName, type ViewStyle } from 'react-native';

export type AppColorScheme = Exclude<ColorSchemeName, null | undefined>;

const palette = {
  amber100: '#FEF3C7',
  amber300: '#FCD34D',
  amber500: '#F59E0B',
  amber700: '#B45309',
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  red100: '#FEE2E2',
  red700: '#B91C1C',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  title: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyStrong: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
} as const;

const lightColors = {
  accent: palette.blue600,
  accentPressed: palette.blue700,
  background: palette.slate50,
  border: palette.slate200,
  borderStrong: palette.slate300,
  cardShadow: palette.slate900,
  danger: palette.red700,
  dangerBackground: palette.red100,
  favorite: palette.amber700,
  favoriteBackground: '#FFFBEB',
  favoriteBorder: palette.amber300,
  favoriteIcon: palette.amber500,
  muted: palette.slate500,
  pressedSurface: palette.slate100,
  surface: palette.white,
  surfaceAlt: palette.slate100,
  textPrimary: palette.slate900,
  textSecondary: palette.slate600,
  textTertiary: palette.slate400,
} as const;

const darkColors = {
  accent: '#60A5FA',
  accentPressed: '#93C5FD',
  background: '#020617',
  border: '#1E293B',
  borderStrong: '#334155',
  cardShadow: '#000000',
  danger: '#FCA5A5',
  dangerBackground: '#450A0A',
  favorite: '#FDE68A',
  favoriteBackground: '#422006',
  favoriteBorder: '#92400E',
  favoriteIcon: '#FBBF24',
  muted: '#94A3B8',
  pressedSurface: '#111827',
  surface: '#0F172A',
  surfaceAlt: '#111827',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
} as const;

type AppColors = Record<keyof typeof lightColors, string>;

export type AppTheme = {
  colorScheme: AppColorScheme;
  colors: AppColors;
  isDark: boolean;
};

export function getAppTheme(colorScheme: ColorSchemeName): AppTheme {
  const normalizedScheme: AppColorScheme =
    colorScheme === 'dark' ? 'dark' : 'light';

  return {
    colorScheme: normalizedScheme,
    colors: normalizedScheme === 'dark' ? darkColors : lightColors,
    isDark: normalizedScheme === 'dark',
  };
}

export function createCardShadow(theme: AppTheme): ViewStyle {
  if (Platform.OS === 'android') {
    return {
      elevation: theme.isDark ? 1 : 2,
    };
  }

  return {
    shadowColor: theme.colors.cardShadow,
    shadowOffset: {
      height: 8,
      width: 0,
    },
    shadowOpacity: theme.isDark ? 0.26 : 0.08,
    shadowRadius: 18,
  };
}

export function createAndroidRipple(theme: AppTheme) {
  if (Platform.OS !== 'android') {
    return undefined;
  }

  return {
    color: theme.isDark
      ? 'rgba(148, 163, 184, 0.18)'
      : 'rgba(15, 23, 42, 0.08)',
    foreground: true,
  };
}

export const minimumHitSlop = {
  bottom: spacing.sm,
  left: spacing.sm,
  right: spacing.sm,
  top: spacing.sm,
} as const;
