import type { AppTheme, ThemeId } from './types';

export const themes: Record<ThemeId, AppTheme> = {
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Midnight blue with soft violet accents',
    emoji: '🌙',

    bg: 'linear-gradient(135deg, #0b1020 0%, #11182d 50%, #0b1020 100%)',

    sidebarBg: 'rgba(11,16,32,0.98)',

    cardBg: 'rgba(24,32,55,0.72)',

    cardBorder: 'rgba(148,163,184,0.14)',

    accent1: '#8b7cf6',
    accent2: '#d946ef',
    accent3: '#22c7d6',

    textPrimary: '#f4f5ff',
    textSecondary: '#9aa4bd',

    glow: '0 0 24px rgba(139,124,246,0.16)',

    gradientText:
      'linear-gradient(135deg, #a78bfa, #e879f9, #67e8f9)',
  },

  light: {
    id: 'light',
    name: 'Light',
    description: 'Crystal clarity with lavender calm',
    emoji: '☀️',

    bg: 'linear-gradient(135deg, #f4f0ff 0%, #edf4ff 50%, #fff0fb 100%)',

    sidebarBg: 'rgba(250,248,255,0.97)',

    cardBg: 'rgba(255,255,255,0.75)',

    cardBorder: 'rgba(124,58,237,0.14)',

    accent1: '#7c3aed',
    accent2: '#db2777',
    accent3: '#0284c7',

    textPrimary: '#1a1040',
    textSecondary: '#6b5e9a',

    glow: '0 4px 20px rgba(124,58,237,0.12)',

    gradientText:
      'linear-gradient(135deg, #7c3aed, #db2777, #0284c7)',
  },

  galaxy: {
    id: 'galaxy',
    name: 'Galaxy',
    description: 'Deep space with a glowing starfield',
    emoji: '🌌',
    bg: `radial-gradient(ellipse 75% 50% at 82% 5%, rgba(91,33,182,0.24), transparent 65%),
      radial-gradient(ellipse 55% 45% at 8% 95%, rgba(14,116,144,0.18), transparent 75%),
      linear-gradient(135deg, #080711 0%, #100d20 52%, #080b16 100%)`,
    sidebarBg: 'rgba(10,9,20,0.97)',
    cardBg: 'rgba(24,20,43,0.78)',
    cardBorder: 'rgba(167,139,250,0.18)',
    accent1: '#a78bfa',
    accent2: '#e879f9',
    accent3: '#67e8f9',
    textPrimary: '#f7f4ff',
    textSecondary: '#aaa2c2',
    glow: '0 0 28px rgba(167,139,250,0.2)',
    gradientText: 'linear-gradient(135deg, #c4b5fd, #f0abfc, #67e8f9)',
  },
};
