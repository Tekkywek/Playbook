import type { BadgeTier, SportId } from '@/types';

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  sportId?: SportId;
  category: 'attendance' | 'reliability' | 'sport' | 'social' | 'scouting' | 'milestone';
  tierThresholds: Partial<Record<BadgeTier, number>>;
}

/** Tier thresholds map to numeric requirements (games, months, etc.) */
export const BADGE_CATALOG: BadgeDef[] = [
  {
    id: 'attendance_first',
    name: 'First Game',
    description: 'Played your first game on PlayBook.',
    category: 'attendance',
    tierThresholds: { bronze: 1, silver: 5, gold: 10, hall_of_fame: 25 },
  },
  {
    id: 'attendance_grinder',
    name: 'Grinder',
    description: 'Keep showing up — games stack into legacy.',
    category: 'attendance',
    tierThresholds: { bronze: 5, silver: 10, gold: 25, hall_of_fame: 50 },
  },
  {
    id: 'attendance_legend',
    name: 'Iron Athlete',
    description: 'Triple-digit games — respect.',
    category: 'attendance',
    tierThresholds: { bronze: 100, silver: 250, gold: 500, hall_of_fame: 500 },
  },
  {
    id: 'reliability_perfect',
    name: 'Never No-Showed',
    description: 'Reliability streak without ghosting.',
    category: 'reliability',
    tierThresholds: { bronze: 5, silver: 15, gold: 40, hall_of_fame: 100 },
  },
  {
    id: 'reliability_month',
    name: 'Perfect Month',
    description: 'Attended every scheduled game in a month.',
    category: 'reliability',
    tierThresholds: { bronze: 1, silver: 3, gold: 6, hall_of_fame: 12 },
  },
  {
    id: 'reliability_iron',
    name: 'Iron Commitment',
    description: 'Six months of showing up.',
    category: 'reliability',
    tierThresholds: { bronze: 6, silver: 6, gold: 6, hall_of_fame: 6 },
  },
  {
    id: 'soccer_hat_trick',
    name: 'Hat Trick Hero',
    description: 'Three goals in a match.',
    sportId: 'soccer',
    category: 'sport',
    tierThresholds: { bronze: 1, silver: 3, gold: 8, hall_of_fame: 20 },
  },
  {
    id: 'soccer_golden_boot',
    name: 'Golden Boot',
    description: 'Top scorer energy.',
    sportId: 'soccer',
    category: 'sport',
    tierThresholds: { bronze: 5, silver: 15, gold: 40, hall_of_fame: 100 },
  },
  {
    id: 'bb_triple_double',
    name: 'Triple Double',
    description: 'Filled the stat sheet.',
    sportId: 'basketball',
    category: 'sport',
    tierThresholds: { bronze: 1, silver: 3, gold: 8, hall_of_fame: 20 },
  },
  {
    id: 'bb_buzzer',
    name: 'Buzzer Beater',
    description: 'Clutch when it counts.',
    sportId: 'basketball',
    category: 'sport',
    tierThresholds: { bronze: 1, silver: 2, gold: 5, hall_of_fame: 10 },
  },
  {
    id: 'tennis_ace',
    name: 'Ace',
    description: 'Unreturnable serves add up.',
    sportId: 'tennis',
    category: 'sport',
    tierThresholds: { bronze: 10, silver: 40, gold: 100, hall_of_fame: 300 },
  },
  {
    id: 'tennis_match_point',
    name: 'Match Point',
    description: 'Closed out matches in style.',
    sportId: 'tennis',
    category: 'sport',
    tierThresholds: { bronze: 3, silver: 10, gold: 30, hall_of_fame: 80 },
  },
  {
    id: 'social_captain',
    name: 'Team Captain',
    description: 'Created and led a team.',
    category: 'social',
    tierThresholds: { bronze: 1, silver: 1, gold: 1, hall_of_fame: 1 },
  },
  {
    id: 'social_league_founder',
    name: 'League Founder',
    description: 'Organized competition for your community.',
    category: 'social',
    tierThresholds: { bronze: 1, silver: 1, gold: 1, hall_of_fame: 1 },
  },
  {
    id: 'social_connector',
    name: 'Connector',
    description: 'Invited players who actually joined.',
    category: 'social',
    tierThresholds: { bronze: 3, silver: 6, gold: 10, hall_of_fame: 25 },
  },
  {
    id: 'social_coach_pick',
    name: "Coach's Pick",
    description: 'Nominated by a coach after standout play.',
    category: 'social',
    tierThresholds: { bronze: 1, silver: 3, gold: 8, hall_of_fame: 20 },
  },
  {
    id: 'scout_highlight',
    name: 'Highlight Reel',
    description: 'Uploaded film that tells your story.',
    category: 'scouting',
    tierThresholds: { bronze: 1, silver: 3, gold: 8, hall_of_fame: 20 },
  },
  {
    id: 'scout_viewed',
    name: 'On the Radar',
    description: 'A scout viewed your profile.',
    category: 'scouting',
    tierThresholds: { bronze: 1, silver: 5, gold: 15, hall_of_fame: 50 },
  },
  {
    id: 'scout_featured',
    name: 'Featured Athlete',
    description: 'Spotlight week — keep climbing.',
    category: 'scouting',
    tierThresholds: { bronze: 1, silver: 1, gold: 1, hall_of_fame: 1 },
  },
  {
    id: 'mile_early',
    name: 'Early Adopter',
    description: 'You were here when PlayBook leveled up.',
    category: 'milestone',
    tierThresholds: { bronze: 1, silver: 1, gold: 1, hall_of_fame: 1 },
  },
  {
    id: 'mile_one_year',
    name: '1 Year on PlayBook',
    description: 'Consistency off the field too.',
    category: 'milestone',
    tierThresholds: { bronze: 1, silver: 1, gold: 1, hall_of_fame: 1 },
  },
  {
    id: 'mile_multi_sport',
    name: 'Triple Threat',
    description: 'Competed in three different sports.',
    category: 'milestone',
    tierThresholds: { bronze: 3, silver: 3, gold: 3, hall_of_fame: 3 },
  },
];

export const TIER_ORDER: BadgeTier[] = ['bronze', 'silver', 'gold', 'hall_of_fame'];
