export const Colors = {
  light: {
    primary: '#1B4D3E',          // Deep peaceful Islamic green
    primaryLight: '#266B57',
    primaryDark: '#113228',
    primaryMuted: '#E8F0EC',

    accentGold: '#D4AF37',       // Subtle gold accent
    accentGoldSoft: '#FAF5E8',

    background: '#F8F9F5',       // Warm off-white
    card: '#FFFFFF',
    cardBorder: '#E7EAE3',

    text: '#1C211E',             // Deep charcoal
    textMuted: '#68706B',
    textSubtle: '#9CA39E',

    success: '#2E7D32',
    warning: '#ED6C02',
    error: '#C62828',
  },
  dark: {
    primary: '#2F8569',
    primaryLight: '#439D80',
    primaryDark: '#1A4D3D',
    primaryMuted: '#1E2D26',

    accentGold: '#E0BC48',
    accentGoldSoft: '#2B261A',

    background: '#111513',
    card: '#1B221E',
    cardBorder: '#27312C',

    text: '#F2F4F2',
    textMuted: '#9BA39E',
    textSubtle: '#626B66',

    success: '#4CAF50',
    warning: '#FFA726',
    error: '#EF5350',
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  headingLarge: {
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  headingMedium: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  headingSmall: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyMuted: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 44,
    textAlign: 'right' as const,
  },
};
