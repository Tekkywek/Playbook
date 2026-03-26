import type { SportId } from '@/types';

/** Base brand — blue / red from spec */
export const brand = {
  blue: '#2D55D4',
  red: '#E53935',
  ink: '#0B1020',
  inkSoft: '#121A2E',
  card: '#151D33',
  cardBorder: 'rgba(255,255,255,0.08)',
  text: '#F4F6FF',
  textMuted: 'rgba(244,246,255,0.62)',
  success: '#2EE59D',
  warn: '#FFC857',
  danger: '#FF5C5C',
};

export const sportAccent: Record<SportId, string> = {
  soccer: '#22C55E',
  basketball: '#F97316',
  football: '#EAB308',
  baseball: '#EF4444',
  tennis: '#84CC16',
  volleyball: '#A855F7',
  lacrosse: '#14B8A6',
  hockey: '#38BDF8',
  swimming: '#06B6D4',
  track: '#F472B6',
  wrestling: '#FB7185',
  golf: '#4ADE80',
  softball: '#F87171',
  rugby: '#15803D',
  pickleball: '#FBBF24',
};

export function getSportAccent(sportId: SportId | undefined): string {
  if (!sportId) return brand.blue;
  return sportAccent[sportId] ?? brand.blue;
}

export const sportTexture = {
  soccer: 'rgba(34,197,94,0.06)',
  basketball: 'rgba(249,115,22,0.07)',
  tennis: 'rgba(132,204,22,0.06)',
  default: 'rgba(45,85,212,0.08)',
};
