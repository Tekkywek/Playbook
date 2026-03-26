import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/** Defaults: Firebase project `playbook-30d83` — override with `EXPO_PUBLIC_FIREBASE_*` in `.env`. */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyDlJIeGwSJdzgmrFaQC4QGV1IjtZ8sCre4',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'playbook-30d83.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'playbook-30d83',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'playbook-30d83.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '676263808230',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '1:676263808230:web:03129e4cced3440f7cff27',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-2XMRL2K1XF',
};

export function isFirebaseConfigured(): boolean {
  return Object.values(firebaseConfig).every((v) => v && String(v).length > 0);
}

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (_app) return _app;
  _app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (_auth) return _auth;
  _auth = getAuth(app);
  return _auth;
}

export function getDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (_db) return _db;
  try {
    _db = initializeFirestore(app, {
      // Helps when WebSocket traffic is blocked; Firestore falls back to long polling.
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    _db = getFirestore(app);
  }
  return _db;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (_storage) return _storage;
  _storage = getStorage(app);
  return _storage;
}

/** Call once on web after app shell mounts. No-ops on native / SSR. */
export function initFirebaseAnalytics(): void {
  if (typeof window === 'undefined') return;
  void (async () => {
    try {
      const { getAnalytics, isSupported } = await import('firebase/analytics');
      const app = getFirebaseApp();
      if (!app || !firebaseConfig.measurementId) return;
      if (await isSupported()) {
        getAnalytics(app);
      }
    } catch {
      /* analytics optional */
    }
  })();
}
