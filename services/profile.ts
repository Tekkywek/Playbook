import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  type Unsubscribe,
} from 'firebase/firestore';
import type { UserProfile, EarnedBadge, PlayerReview, HighlightClip, SportProfile } from '@/types';
import { getDb } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { evaluateAndSyncBadges } from '@/services/badges';

/** One-shot read — avoids waiting on the first snapshot (which can stall on some networks). */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as UserProfile;
}

export function subscribeProfile(
  uid: string,
  onData: (p: UserProfile | null) => void,
  onError?: (e: Error) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData(null);
    return () => {};
  }
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData({ uid, ...snap.data() } as UserProfile);
    },
    (err) => onError?.(err as Error)
  );
}

export async function ensureProfileShell(user: User): Promise<void> {
  const db = getDb();
  if (!db) return;
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    // Do not merge defaults here — a previous `merge: true` with `onboardingComplete: false`
    // overwrote completed onboarding on every login. Only sync auth-linked fields.
    await setDoc(
      ref,
      {
        uid: user.uid,
        email: user.email,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return;
  }

  await setDoc(ref, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? 'Athlete',
    photoURL: user.photoURL,
    sports: [],
    primarySportId: 'soccer',
    role: 'player',
    ageGroup: 'adult_rec',
    location: null,
    goals: [],
    onboardingComplete: false,
    reliabilityScore: 85,
    skillRatingAvg: 3.5,
    gamesPlayed: 0,
    gamesWon: 0,
    gamesNoShow: 0,
    streakCount: 0,
    lastStreakResetAt: null,
    leaguesJoined: 0,
    teamsCount: 0,
    scoutingMode: false,
    premiumTier: 'free',
    coachChannelLimit: 3,
    badges: [] as EarnedBadge[],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function completeOnboarding(
  uid: string,
  data: {
    displayName: string;
    photoURL: string | null;
    sports: SportProfile[];
    primarySportId: UserProfile['primarySportId'];
    role: UserProfile['role'];
    ageGroup: UserProfile['ageGroup'];
    location: NonNullable<UserProfile['location']>;
    goals: UserProfile['goals'];
  }
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firebase not configured');
  await setDoc(
    doc(db, 'users', uid),
    {
      displayName: data.displayName,
      photoURL: data.photoURL,
      sports: data.sports,
      primarySportId: data.primarySportId,
      role: data.role,
      ageGroup: data.ageGroup,
      location: data.location,
      goals: data.goals,
      onboardingComplete: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateProfileFields(uid: string, patch: Partial<UserProfile>): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firebase not configured');
  await updateDoc(doc(db, 'users', uid), {
    ...patch,
    updatedAt: serverTimestamp(),
  } as Record<string, unknown>);
}

export async function fetchRecentReviews(uid: string, max = 8): Promise<PlayerReview[]> {
  const db = getDb();
  if (!db) return [];
  const q = query(
    collection(db, 'users', uid, 'reviews'),
    orderBy('createdAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PlayerReview));
}

export async function fetchHighlights(uid: string): Promise<HighlightClip[]> {
  const db = getDb();
  if (!db) return [];
  const q = query(collection(db, 'users', uid, 'highlights'), orderBy('createdAt', 'desc'), limit(24));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as HighlightClip));
}

/** Call after game stats change — client-side badge tier sync */
export async function syncBadgesForUser(uid: string, profile: UserProfile): Promise<void> {
  await evaluateAndSyncBadges(uid, profile);
}
