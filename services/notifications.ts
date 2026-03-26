import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  limit,
  updateDoc,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import type { NotificationDoc, NotificationType } from '@/types';
import { getDb } from '@/lib/firebase';

export function subscribeNotifications(
  uid: string,
  onData: (n: NotificationDoc[]) => void
): Unsubscribe | (() => void) {
  const db = getDb();
  if (!db) {
    onData([]);
    return () => {};
  }
  const q = query(
    collection(db, 'users', uid, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(80)
  );
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as NotificationDoc)));
  });
}

export async function pushNotification(
  uid: string,
  payload: {
    type: NotificationType;
    title: string;
    body: string;
    deepLink: string;
  }
): Promise<void> {
  const db = getDb();
  if (!db) return;
  await addDoc(collection(db, 'users', uid, 'notifications'), {
    uid,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    read: false,
    deepLink: payload.deepLink,
    createdAt: serverTimestamp(),
  });
}

export async function markRead(uid: string, notificationId: string) {
  const db = getDb();
  if (!db) return;
  await updateDoc(doc(db, 'users', uid, 'notifications', notificationId), {
    read: true,
  });
}
