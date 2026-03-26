import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  where,
  limit,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import type { LeagueDoc, LeagueFormat, SportId } from '@/types';
import { getDb } from '@/lib/firebase';

export function subscribeLeagues(
  sportId: SportId,
  onData: (rows: LeagueDoc[]) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData([]);
    return () => {};
  }
  const q = query(collection(db, 'leagues'), where('sportId', '==', sportId), limit(40));
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeagueDoc)));
  });
}

export function subscribeLeague(
  leagueId: string,
  onData: (row: LeagueDoc | null) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData(null);
    return () => {};
  }
  return onSnapshot(doc(db, 'leagues', leagueId), (snap) => {
    if (!snap.exists()) onData(null);
    else onData({ id: snap.id, ...snap.data() } as LeagueDoc);
  });
}

export async function createLeague(input: {
  commissionerUid: string;
  name: string;
  sportId: SportId;
  format: LeagueFormat;
  seasonStart: Date;
  seasonEnd: Date;
  teamLimit: number;
  feeCents: number;
  rules: string;
  locationLabel: string;
}): Promise<string> {
  const db = getDb();
  if (!db) throw new Error('Firebase not configured');
  const ref = await addDoc(collection(db, 'leagues'), {
    name: input.name,
    sportId: input.sportId,
    format: input.format,
    seasonStart: Timestamp.fromDate(input.seasonStart),
    seasonEnd: Timestamp.fromDate(input.seasonEnd),
    teamLimit: input.teamLimit,
    registeredTeamIds: [],
    feeCents: input.feeCents,
    rules: input.rules,
    locationLabel: input.locationLabel,
    standings: [],
    commissionerUid: input.commissionerUid,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
