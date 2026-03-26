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
import type { UserProfile } from '@/types';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import { ensureProfileShell, fetchUserProfile, subscribeProfile } from '@/services/profile';

interface AuthState {
  firebaseReady: boolean;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  /** Merge into local profile (e.g. after onboarding) so navigation isn’t blocked on the next snapshot. */
  mergeLocalProfile: (patch: Partial<UserProfile>) => void;
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
        setProfile(null);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    let cancelled = false;
    let unsub: (() => void) | undefined;

    void (async () => {
      try {
        await ensureProfileShell(user);
        if (cancelled) return;
        unsub = subscribeProfile(
          user.uid,
          (p) => {
            if (!cancelled) setProfile(p);
          },
          () => {
            if (!cancelled) setProfileLoading(false);
          }
        );
        const p = await fetchUserProfile(user.uid);
        if (!cancelled) setProfile(p);
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [user?.uid]);

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
    setProfile((p) => (p ? { ...p, ...patch } : null));
  }, []);

  const value = useMemo(
    () => ({
      firebaseReady,
      user,
      profile,
      loading,
      profileLoading,
      mergeLocalProfile,
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
