import type { Timestamp } from 'firebase/firestore';

export type SportId =
  | 'soccer'
  | 'basketball'
  | 'football'
  | 'baseball'
  | 'tennis'
  | 'volleyball'
  | 'lacrosse'
  | 'hockey'
  | 'swimming'
  | 'track'
  | 'wrestling'
  | 'golf'
  | 'softball'
  | 'rugby'
  | 'pickleball';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export type UserRole = 'player' | 'coach' | 'both';

export type AgeGroup =
  | 'youth_u8'
  | 'youth_u10'
  | 'youth_u12'
  | 'youth_u14'
  | 'youth_u16'
  | 'youth_u18'
  | 'high_school'
  | 'college'
  | 'adult_rec'
  | 'adult_competitive'
  | 'pro';

export type UserGoal =
  | 'pickup'
  | 'league'
  | 'recruited'
  | 'manage_team'
  | 'coach_team'
  | 'stats'
  | 'all';

export interface SportProfile {
  sportId: SportId;
  positions: string[];
  skillLevel: SkillLevel;
}

export type PremiumTier = 'free' | 'athlete_pro' | 'coach_pro' | 'club_elite';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string | null;
  /** Local-only customization (not required to exist in Firestore). */
  cardBorderColor?: string;
  sports: SportProfile[];
  primarySportId: SportId;
  role: UserRole;
  ageGroup: AgeGroup;
  location: {
    city: string;
    region?: string;
    lat: number;
    lng: number;
  } | null;
  goals: UserGoal[];
  onboardingComplete: boolean;
  reliabilityScore: number;
  skillRatingAvg: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesNoShow: number;
  streakCount: number;
  lastStreakResetAt: Timestamp | null;
  leaguesJoined: number;
  teamsCount: number;
  scoutingMode: boolean;
  premiumTier: PremiumTier;
  coachChannelLimit: number;
  badges?: EarnedBadge[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  fcmTokens?: string[];
}

export type GameType = 'pickup' | 'scrimmage' | 'tournament' | 'skills' | 'practice_open';

export type GameVisibility = 'public' | 'invite_only' | 'teams_only';

export interface GamePlayer {
  uid: string;
  joinedAt: Timestamp;
  status: 'joined' | 'waitlist' | 'cancelled';
}

export interface GameDoc {
  id: string;
  hostId: string;
  sportId: SportId;
  gameType: GameType;
  title: string;
  description: string;
  locationLabel: string;
  lat: number;
  lng: number;
  startsAt: Timestamp;
  durationMinutes: number;
  playerLimit: number;
  minSkill: SkillLevel;
  players: GamePlayer[];
  entryFeeCents: number;
  visibility: GameVisibility;
  coverImageUrl: string | null;
  indoor: boolean;
  ended: boolean;
  createdAt: Timestamp;
}

export type TeamChannelId = 'general' | 'announcements' | 'film' | 'logistics' | string;

export interface TeamMember {
  uid: string;
  role: 'player' | 'coach' | 'captain';
  position?: string;
  joinedAt: Timestamp;
}

export interface TeamEvent {
  id: string;
  title: string;
  startsAt: Timestamp;
  type: 'practice' | 'game' | 'other';
  location?: string;
}

export interface TeamDoc {
  id: string;
  name: string;
  sportId: SportId;
  ageGroup: AgeGroup;
  logoUrl: string | null;
  visibility: 'public' | 'invite_only';
  inviteCode: string;
  memberIds: string[];
  members: TeamMember[];
  coachUid: string;
  channels: { id: TeamChannelId; name: string }[];
  events: TeamEvent[];
  wins: number;
  losses: number;
  createdAt: Timestamp;
}

export type LeagueFormat = 'round_robin' | 'single_elim' | 'double_elim' | 'ladder';

export interface StandingRow {
  teamId: string;
  teamName: string;
  wins: number;
  losses: number;
  points: number;
  diff: number;
}

export interface LeagueDoc {
  id: string;
  name: string;
  sportId: SportId;
  format: LeagueFormat;
  seasonStart: Timestamp;
  seasonEnd: Timestamp;
  teamLimit: number;
  registeredTeamIds: string[];
  feeCents: number;
  rules: string;
  locationLabel: string;
  standings: StandingRow[];
  commissionerUid: string;
  createdAt: Timestamp;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'hall_of_fame';

export interface EarnedBadge {
  badgeId: string;
  tier: BadgeTier;
  earnedAt: Timestamp;
  progress?: number;
}

export type NotificationType =
  | 'game_invite'
  | 'game_join'
  | 'game_reminder'
  | 'rating_request'
  | 'badge'
  | 'team_announcement'
  | 'league_result'
  | 'scout_view'
  | 'follow'
  | 'highlight_comment';

export interface NotificationDoc {
  id: string;
  uid: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  deepLink: string;
  createdAt: Timestamp;
}

export interface PlayerReview {
  id: string;
  fromUid: string;
  gameId: string;
  skillStars: number;
  reliabilityStars: number;
  comment?: string;
  createdAt: Timestamp;
}

export interface HighlightClip {
  id: string;
  storageUrl: string;
  thumbnailUrl: string;
  sportId: SportId;
  views: number;
  createdAt: Timestamp;
  scoutVisible: boolean;
}
