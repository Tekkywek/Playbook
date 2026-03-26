import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getFirebaseAuth } from '@/lib/firebase';
import { PrimaryButton } from '@/components/ui/Button';
import { brand } from '@/constants/theme';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { user, loading, sendVerificationEmail, reloadAuthUser, signOut } = useAuth();
  const [busy, setBusy] = useState<'resend' | 'check' | null>(null);

  const onResend = useCallback(async () => {
    setBusy('resend');
    try {
      await sendVerificationEmail();
      Alert.alert('Email sent', 'Check your inbox for the verification link from Firebase.');
    } catch (e) {
      Alert.alert('Could not send email', e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }, [sendVerificationEmail]);

  const onChecked = useCallback(async () => {
    setBusy('check');
    try {
      await reloadAuthUser();
      const fresh = getFirebaseAuth()?.currentUser;
      if (fresh?.emailVerified) {
        router.replace('/');
        return;
      }
      Alert.alert('Not verified yet', 'Open the link in your email, then tap “I’ve verified” again.');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }, [reloadAuthUser, router]);

  if (loading) {
    return <View style={styles.center} />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.emailVerified) {
    return <Redirect href="/" />;
  }

  const email = user.email ?? 'your email';

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.kicker}>VERIFY YOUR EMAIL</Text>
      <Text style={styles.title}>Check your inbox</Text>
      <Text style={styles.body}>
        We sent a verification link to <Text style={styles.email}>{email}</Text>. Google sign-in accounts are already
        verified; this step applies to email & password sign-ups.
      </Text>
      <PrimaryButton
        title={busy === 'resend' ? 'Sending…' : 'Resend verification email'}
        onPress={onResend}
        loading={busy === 'resend'}
      />
      <View style={{ height: 12 }} />
      <PrimaryButton
        title={busy === 'check' ? 'Checking…' : "I've verified — continue"}
        onPress={onChecked}
        loading={busy === 'check'}
      />
      <View style={{ height: 12 }} />
      <PrimaryButton title="Sign out" onPress={() => void signOut().then(() => router.replace('/login'))} accent={brand.card} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: brand.ink,
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: brand.ink,
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 40,
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  kicker: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 2,
    color: brand.textMuted,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 28,
    color: brand.text,
    marginBottom: 16,
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 23,
    color: brand.textMuted,
    marginBottom: 28,
  },
  email: {
    fontFamily: 'DMSans_600SemiBold',
    color: brand.text,
  },
});
