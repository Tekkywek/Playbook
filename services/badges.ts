import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { BadgeTier, EarnedBadge, UserProfile } from '@/types';
import { BADGE_CATALOG, TIER_ORDER } from '@/constants/badges';
import { getDb } from '@/lib/firebase';

function tierForValue(thresholds: Partial<Record<BadgeTier, number>>, value: number): BadgeTier | null {
  let best: BadgeTier | null = null;
  for (const tier of TIER_ORDER) {
    const t = thresholds[tier];
    if (t != null && value >= t) best = tier;
  }
  return best;
}

function metricForDef(defId: string, profile: UserProfile): number {
  if (defId.startsWith('attendance') || defId === 'reliability_perfect') {
    return profile.gamesPlayed;
  }
  if (defId === 'reliability_iron') {
    return profile.streakCount >= 26 ? 6 : 0;
  }
  return profile.gamesPlayed;
}

export async function evaluateAndSyncBadges(uid: string, profile: UserProfile): Promise<void> {
  const db = getDb();
  if (!db) return;

  const prevMap = new Map((profile.badges ?? []).map((b) => [b.badgeId, b]));
  const out: EarnedBadge[] = [];

  for (const def of BADGE_CATALOG) {
    if (def.sportId && def.sportId !== profile.primarySportId) continue;
    if (def.category !== 'attendance' && def.category !== 'reliability') continue;

    const metric = metricForDef(def.id, profile);
    const tier = tierForValue(def.tierThresholds, metric);
    if (!tier) continue;

    const prev = prevMap.get(def.id);
    const newTierIdx = TIER_ORDER.indexOf(tier);
    const oldTierIdx = prev ? TIER_ORDER.indexOf(prev.tier) : -1;
    const useTier = !prev || newTierIdx > oldTierIdx ? tier : prev.tier;

    out.push({
      badgeId: def.id,
      tier: useTier,
      earnedAt: prev?.earnedAt ?? Timestamp.now(),
      progress: metric,
    });
  }

  for (const b of profile.badges ?? []) {
    if (!out.find((x) => x.badgeId === b.badgeId)) {
      out.push(b);
    }
  }

  await updateDoc(doc(db, 'users', uid), {
    badges: out,
    updatedAt: serverTimestamp(),
  });
}
