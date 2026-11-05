/**
 * ECO FINVIET Design System — TypeScript Token Constants
 * Source: ECO Design System / ECO-FINVIET-Design-System.html
 */

export const ECO_COLORS = {
  // Brand Core
  blue: '#006FDA',
  blueHover: '#1A94FF',
  yellow: '#FFCA00',
  yellowHover: '#FECD4D',
  articBlue: '#4AC3FF',
  deepAqua: '#00C1C1',
  orangeCitrus: '#F78700',
  gold: '#FAC515',

  // Semantics & Alert
  danger: '#C0263A',
  dangerBright: '#E5252B',
  warningText: '#E8590C',

  // Content & Typography
  textPrimary: '#1F1F1F',
  textSecondary: '#595959',
  textTertiary: '#8C8C8C',
  textDisabled: '#BFBFBF',
  textInverse: '#FFFFFF',
  textLabel: '#141414',

  // Surfaces & Backgrounds
  bgCanvas: '#F5F5F5',
  bgSunken: '#FAFAFA',
  bgSurface: '#FFFFFF',
  bgSolid: '#1F1F1F',
  bgInputSoft: '#F6F7FB',
  bgNeutralSoft: '#F3F4F8',

  // Borders
  borderDefault: '#D9D9D9',
  borderSubtle: '#F0F0F0',
} as const;

export const ECO_SPACING = {
  space4: '4px',
  space8: '8px',
  space12: '12px',
  space16: '16px',
  space24: '24px',
  space32: '32px',
  space48: '48px',
} as const;

export const ECO_RADII = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  full: '9999px',
} as const;

export const ECO_SHADOWS = {
  xs: '0 1px 2px rgba(31, 31, 31, 0.08)',
  sm: '0 2px 4px rgba(31, 31, 31, 0.08), 0 1px 2px rgba(31, 31, 31, 0.06)',
  md: '0 4px 8px rgba(31, 31, 31, 0.10), 0 2px 4px rgba(31, 31, 31, 0.06)',
  lg: '0 8px 16px rgba(31, 31, 31, 0.12), 0 4px 8px rgba(31, 31, 31, 0.06)',
  xl: '0 16px 32px rgba(31, 31, 31, 0.16), 0 6px 12px rgba(31, 31, 31, 0.08)',
} as const;
