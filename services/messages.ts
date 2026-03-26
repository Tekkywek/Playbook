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

export interface ChatMessage {
  id: string;
  uid: string;
  text: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
}

export function subscribeChannelMessages(
  teamId: string,
  channelId: string,
  onData: (msgs: ChatMessage[]) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData([]);
    return () => {};
  }
  const q = query(
    collection(db, 'teams', teamId, 'channels', channelId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(100)
  );
  return onSnapshot(q, (snap) => {
    onData(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ChatMessage[]
    );
  });
}

export async function sendChannelMessage(teamId: string, channelId: string, uid: string, text: string) {
  const db = getDb();
  if (!db) throw new Error('Firebase not configured');
  await addDoc(collection(db, 'teams', teamId, 'channels', channelId, 'messages'), {
    uid,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });
}
