import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  limit,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import type { TeamDoc, TeamMember, AgeGroup, SportId } from '@/types';
import { getDb } from '@/lib/firebase';
import * as Crypto from 'expo-crypto';

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function subscribeMyTeams(
  uid: string,
  onData: (teams: TeamDoc[]) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData([]);
    return () => {};
  }
  const q = query(collection(db, 'teams'), where('memberIds', 'array-contains', uid), limit(40));
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamDoc)));
  });
}

export function subscribePublicTeams(
  sportId: SportId,
  onData: (teams: TeamDoc[]) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData([]);
    return () => {};
  }
  const q = query(
    collection(db, 'teams'),
    where('sportId', '==', sportId),
    where('visibility', '==', 'public'),
    limit(40)
  );
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamDoc)));
  });
}

export function subscribeTeam(
  teamId: string,
  onData: (t: TeamDoc | null) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData(null);
    return () => {};
  }
  return onSnapshot(doc(db, 'teams', teamId), (snap) => {
    if (!snap.exists()) onData(null);
    else onData({ id: snap.id, ...snap.data() } as TeamDoc);
  });
}

export async function createTeam(input: {
  coachUid: string;
  name: string;
  sportId: SportId;
  ageGroup: AgeGroup;
  logoUrl: string | null;
  visibility: TeamDoc['visibility'];
}): Promise<string> {
  const db = getDb();
  if (!db) throw new Error('Firebase not configured');
  const inviteCode = randomCode();
  const member: TeamMember = {
    uid: input.coachUid,
    role: 'coach',
    joinedAt: Timestamp.now(),
  };
  const channels = [
    { id: 'general', name: 'General' },
    { id: 'announcements', name: 'Announcements' },
    { id: 'film', name: 'Film Review' },
    { id: 'logistics', name: 'Logistics' },
  ];
  const ref = await addDoc(collection(db, 'teams'), {
    name: input.name,
    sportId: input.sportId,
    ageGroup: input.ageGroup,
    logoUrl: input.logoUrl,
    visibility: input.visibility,
    inviteCode,
    memberIds: [input.coachUid],
    members: [member],
    coachUid: input.coachUid,
    channels,
    events: [],
    wins: 0,
    losses: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function joinTeamByCode(teamId: string, uid: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firebase not configured');
  const ref = doc(db, 'teams', teamId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Team not found');
  const t = snap.data() as Omit<TeamDoc, 'id'>;
  if ((t.memberIds ?? []).includes(uid)) return;
  const member: TeamMember = {
    uid,
    role: 'player',
    joinedAt: Timestamp.now(),
  };
  await updateDoc(ref, {
    memberIds: [...(t.memberIds ?? []), uid],
    members: [...(t.members ?? []), member],
  });
}

export async function addTeamEvent(
  teamId: string,
  event: { title: string; startsAt: Date; type: 'practice' | 'game' | 'other'; location?: string }
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firebase not configured');
  const id = Crypto.randomUUID();
  await updateDoc(doc(db, 'teams', teamId), {
    events: arrayUnion({
      id,
      title: event.title,
      startsAt: Timestamp.fromDate(event.startsAt),
      type: event.type,
      location: event.location ?? '',
    }),
  });
}
