import * as Notifications from 'expo-notifications';
import { doc, setDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerPush(uid: string): Promise<void> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const token = (
    await Notifications.getExpoPushTokenAsync(projectId ? { projectId: String(projectId) } : undefined)
  ).data;
  const db = getDb();
  if (!db) return;
  await setDoc(
    doc(db, 'users', uid),
    {
      fcmTokens: arrayUnion(token),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
