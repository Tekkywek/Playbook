import type { SportId } from '@/types';

export const SPORTS: { id: SportId; label: string; emoji: string }[] = [
  { id: 'soccer', label: 'Soccer', emoji: '⚽' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'football', label: 'Football', emoji: '🏈' },
  { id: 'baseball', label: 'Baseball', emoji: '⚾' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
  { id: 'volleyball', label: 'Volleyball', emoji: '🏐' },
  { id: 'lacrosse', label: 'Lacrosse', emoji: '🥍' },
  { id: 'hockey', label: 'Hockey', emoji: '🏒' },
  { id: 'swimming', label: 'Swimming', emoji: '🏊' },
  { id: 'track', label: 'Track & Field', emoji: '🏃' },
  { id: 'wrestling', label: 'Wrestling', emoji: '🤼' },
  { id: 'golf', label: 'Golf', emoji: '⛳' },
  { id: 'softball', label: 'Softball', emoji: '🥎' },
  { id: 'rugby', label: 'Rugby', emoji: '🏉' },
  { id: 'pickleball', label: 'Pickleball', emoji: '🏓' },
];

export const POSITIONS_BY_SPORT: Record<SportId, string[]> = {
  soccer: ['GK', 'DEF', 'MID', 'FWD', 'Utility'],
  basketball: ['PG', 'SG', 'SF', 'PF', 'C'],
  football: ['QB', 'RB', 'WR', 'OL', 'DL', 'LB', 'DB', 'K'],
  baseball: ['P', 'C', 'IF', 'OF', 'DH'],
  tennis: ['Singles', 'Doubles'],
  volleyball: ['Setter', 'Outside', 'Middle', 'Libero', 'Opposite'],
  lacrosse: ['Attack', 'Mid', 'Defense', 'Goalie'],
  hockey: ['C', 'W', 'D', 'G'],
  swimming: ['Sprint', 'Distance', 'IM', 'Stroke'],
  track: ['Sprints', 'Distance', 'Jumps', 'Throws'],
  wrestling: ['Light', 'Mid', 'Heavy'],
  golf: ['Player'],
  softball: ['P', 'C', 'IF', 'OF'],
  rugby: ['Forward', 'Back'],
  pickleball: ['Right', 'Left', 'Both'],
};
