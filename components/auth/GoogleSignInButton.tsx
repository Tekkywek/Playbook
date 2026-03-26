import React, { useEffect, useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { getFirebaseAuth } from '@/lib/firebase';
import { brand } from '@/constants/theme';

WebBrowser.maybeCompleteAuthSession();

type Appearance = 'onLight' | 'onDark';

function isBenignAuthError(e: unknown): boolean {
  if (e && typeof e === 'object' && 'code' in e) {
    const code = String((e as { code?: string }).code);
    return (
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/popup-blocked'
    );
  }
  return false;
}

function GoogleSignInWeb({ appearance }: { appearance: Appearance }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const dark = appearance === 'onDark';

  const onPress = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      Alert.alert('Sign in', 'Firebase is not configured.');
      return;
    }
    setBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      router.replace('/');
    } catch (e) {
      if (isBenignAuthError(e)) return;
      const msg = e instanceof FirebaseError ? e.message : String(e);
      Alert.alert('Google sign-in failed', msg);
    } finally {
      setBusy(false);
    }
  }, [router]);

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => [
        dark ? styles.rowDark : styles.rowLight,
        pressed && { opacity: 0.92 },
        busy && { opacity: 0.72 },
      ]}
    >
      {busy ? (
        <ActivityIndicator color={dark ? '#fff' : '#444'} />
      ) : (
        <>
          <FontAwesome name="google" size={20} color="#4285F4" />
          <Text style={dark ? styles.labelDark : styles.labelLight}>Continue with Google</Text>
        </>
      )}
    </Pressable>
  );
}

function GoogleSignInNative({ appearance, webClientId }: { appearance: Appearance; webClientId: string }) {
  const router = useRouter();
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const dark = appearance === 'onDark';

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId,
    iosClientId: iosClientId || undefined,
    androidClientId: androidClientId || undefined,
  });

  useEffect(() => {
    const run = async () => {
      if (response?.type === 'success' && response.params.id_token) {
        const auth = getFirebaseAuth();
        if (!auth) return;
        const cred = GoogleAuthProvider.credential(response.params.id_token);
        await signInWithCredential(auth, cred);
        router.replace('/');
      } else if (response?.type === 'error') {
        Alert.alert('Google sign-in failed', response.error?.message ?? 'Unknown error');
      }
    };
    run().catch((e) => {
      if (!isBenignAuthError(e)) Alert.alert('Google sign-in failed', String(e));
    });
  }, [response, router]);

  return (
    <Pressable
      onPress={() => void promptAsync()}
      disabled={!request}
      style={({ pressed }) => [
        dark ? styles.rowDark : styles.rowLight,
        pressed && { opacity: 0.92 },
        !request && { opacity: 0.72 },
      ]}
    >
      {!request ? (
        <ActivityIndicator color={dark ? '#fff' : '#444'} />
      ) : (
        <>
          <FontAwesome name="google" size={20} color="#4285F4" />
          <Text style={dark ? styles.labelDark : styles.labelLight}>Continue with Google</Text>
        </>
      )}
    </Pressable>
  );
}

/** Google Sign-In: web uses Firebase popup; native uses Expo Auth Session + ID token (needs Web client ID in env). */
export function GoogleSignInButton({ appearance = 'onLight' }: { appearance?: Appearance }) {
  if (Platform.OS === 'web') {
    return <GoogleSignInWeb appearance={appearance} />;
  }
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!webClientId) {
    return null;
  }
  return <GoogleSignInNative appearance={appearance} webClientId={webClientId} />;
}

const styles = StyleSheet.create({
  rowLight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: '#fff',
  },
  rowDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  labelLight: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: '#1a1a1a',
  },
  labelDark: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: brand.text,
  },
});
