import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

export interface ActivityItem {
  id: string;
  kind: 'teammate' | 'game' | 'badge' | 'highlight';
  title: string;
  subtitle?: string;
  createdAt: unknown;
}

export function subscribeActivityFeed(
  uid: string,
  onData: (items: ActivityItem[]) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData([]);
    return () => {};
  }
  const q = query(
    collection(db, 'users', uid, 'activity'),
    orderBy('createdAt', 'desc'),
    limit(40)
  );
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityItem)));
    },
    () => onData([])
  );
}

export async function seedActivityForUser(uid: string) {
  const db = getDb();
  if (!db) return;
  await addDoc(collection(db, 'users', uid, 'activity'), {
    kind: 'game',
    title: 'Welcome to PlayBook',
    subtitle: 'Your feed fills in as teammates play, earn badges, and post highlights.',
    createdAt: serverTimestamp(),
  });
}
