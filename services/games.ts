import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import type { GameDoc, GamePlayer, SkillLevel, SportId } from '@/types';
import { getDb } from '@/lib/firebase';

export function subscribeUpcomingGames(
  onData: (games: GameDoc[]) => void,
  onError?: (e: Error) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData([]);
    return () => {};
  }
  const now = Timestamp.now();
  const q = query(
    collection(db, 'games'),
    where('startsAt', '>=', now),
    orderBy('startsAt', 'asc'),
    limit(80)
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as GameDoc));
      onData(list);
    },
    (err) => onError?.(err as Error)
  );
}

export function subscribeGame(
  gameId: string,
  onData: (g: GameDoc | null) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData(null);
    return () => {};
  }
  return onSnapshot(doc(db, 'games', gameId), (snap) => {
    if (!snap.exists()) onData(null);
    else onData({ id: snap.id, ...snap.data() } as GameDoc);
  });
}

export async function getGame(gameId: string): Promise<GameDoc | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, 'games', gameId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as GameDoc;
}

export async function createGame(input: {
  hostId: string;
  sportId: SportId;
  gameType: GameDoc['gameType'];
  title: string;
  description: string;
  locationLabel: string;
  lat: number;
  lng: number;
  startsAt: Date;
  durationMinutes: number;
  playerLimit: number;
  minSkill: SkillLevel;
  entryFeeCents: number;
  visibility: GameDoc['visibility'];
  coverImageUrl: string | null;
  indoor: boolean;
}): Promise<string> {
  const db = getDb();
  if (!db) throw new Error('Firebase not configured');
  const hostPlayer: GamePlayer = {
    uid: input.hostId,
    joinedAt: Timestamp.now(),
    status: 'joined',
  };
  const ref = await addDoc(collection(db, 'games'), {
    hostId: input.hostId,
    sportId: input.sportId,
    gameType: input.gameType,
    title: input.title,
    description: input.description,
    locationLabel: input.locationLabel,
    lat: input.lat,
    lng: input.lng,
    startsAt: Timestamp.fromDate(input.startsAt),
    durationMinutes: input.durationMinutes,
    playerLimit: input.playerLimit,
    minSkill: input.minSkill,
    players: [hostPlayer],
    entryFeeCents: input.entryFeeCents,
    visibility: input.visibility,
    coverImageUrl: input.coverImageUrl,
    indoor: input.indoor,
    ended: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function joinGame(gameId: string, uid: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firebase not configured');
  const gref = doc(db, 'games', gameId);
  const snap = await getDoc(gref);
  if (!snap.exists()) throw new Error('Game not found');
  const g = snap.data() as Omit<GameDoc, 'id'>;
  const players: GamePlayer[] = [...(g.players ?? [])];
  if (players.some((p) => p.uid === uid && p.status === 'joined')) return;
  const count = players.filter((p) => p.status === 'joined').length;
  if (count >= g.playerLimit) throw new Error('Game is full');
  players.push({
    uid,
    joinedAt: Timestamp.now(),
    status: 'joined',
  });
  await updateDoc(gref, { players });
}

export function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
