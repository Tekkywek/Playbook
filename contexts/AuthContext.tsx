import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification as firebaseSendEmailVerification,
  reload,
  type User,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from '@/types';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';

const LOCAL_PROFILE_KEY = 'playbook.localProfile.v1';

interface AuthState {
  firebaseReady: boolean;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  /** Merge into local profile (e.g. after onboarding) so navigation isn’t blocked on the next snapshot. */
  mergeLocalProfile: (patch: Partial<UserProfile>) => void;
  /** Clear local (device) profile without touching the account. */
  clearLocalProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  reloadAuthUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const firebaseReady = isFirebaseConfigured();

  // Load the local (device) profile once so onboarding/dashboard can work without Firestore.
  useEffect(() => {
    let cancelled = false;
    setProfileLoading(true);
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(LOCAL_PROFILE_KEY);
        if (cancelled) return;
        if (raw) setProfile(JSON.parse(raw) as UserProfile);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (!u) {
        // Keep local profile (device-only) so users can proceed without Firestore.
      }
    });
    return unsub;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase is not configured. Add keys to .env');
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase is not configured. Add keys to .env');
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await firebaseSendEmailVerification(cred.user);
  }, []);

  const signOutFn = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    const auth = getFirebaseAuth();
    const u = auth?.currentUser;
    if (!u?.email) throw new Error('No signed-in user with an email address.');
    await firebaseSendEmailVerification(u);
  }, []);

  const reloadAuthUser = useCallback(async () => {
    const auth = getFirebaseAuth();
    const u = auth?.currentUser;
    if (!u) return;
    await reload(u);
  }, []);

  const mergeLocalProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = (prev ? { ...prev, ...patch } : ({ ...patch } as UserProfile)) as UserProfile;
      void AsyncStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearLocalProfile = useCallback(async () => {
    await AsyncStorage.removeItem(LOCAL_PROFILE_KEY);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      firebaseReady,
      user,
      profile,
      loading,
      profileLoading,
      mergeLocalProfile,
      clearLocalProfile,
      signIn,
      signUp,
      signOut: signOutFn,
      sendVerificationEmail,
      reloadAuthUser,
    }),
    [
      firebaseReady,
      user,
      profile,
      loading,
      profileLoading,
      mergeLocalProfile,
      clearLocalProfile,
      signIn,
      signUp,
      signOutFn,
      sendVerificationEmail,
      reloadAuthUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
