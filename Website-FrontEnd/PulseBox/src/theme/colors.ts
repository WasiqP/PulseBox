/**
 * PulseBox Website Theme
 * Matches the mobile app theme exactly
 */

export const palette = {
  black: '#000000',
  white: '#FFFFFF',
  primaryPurple: '#A060FF',
  aquaBlue: '#00E4E3',
  softWhiteTint: '#FEFDFF',
  lightLavenderTint: '#E0CBFF',
  gray: '#1A1A1A',
  grayMid: '#2A2A2A',
  grayLight: '#3A3A3A',
};

export const theme = {
  // Modern purple-themed aesthetic
  background: palette.softWhiteTint,
  backgroundAlt: palette.lightLavenderTint,
  primary: palette.primaryPurple,
  primaryAlt: palette.aquaBlue,
  text: palette.black,
  textDim: 'rgba(0,0,0,0.6)',
  border: palette.lightLavenderTint,
  card: palette.white,
  accent: palette.aquaBlue,
  white: palette.white,
};

export type AppTheme = typeof theme;

