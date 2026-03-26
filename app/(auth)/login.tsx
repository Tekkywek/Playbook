import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { useRouter, useLocalSearchParams, type Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { PrimaryButton } from '@/components/ui/Button';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { brand } from '@/constants/theme';

/**
 * Web (Next.js): served from `/public/auth-hero.jpg`.
 * Native (Expo/Metro): bundled from `assets/`.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const HERO_NATIVE = require('../../assets/auth-hero.jpg');

function getHeroSource(): ImageSourcePropType {
  if (Platform.OS === 'web') {
    return { uri: '/auth-hero.jpg' };
  }
  return HERO_NATIVE;
}

const SPLIT_MIN_WIDTH = 880;

type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { width } = useWindowDimensions();
  const split = width >= SPLIT_MIN_WIDTH;

  const [mode, setMode] = useState<AuthMode>(() =>
    params.mode === 'signup' ? 'signup' : 'login'
  );

  useEffect(() => {
    if (params.mode === 'signup') setMode('signup');
    if (params.mode === 'login') setMode('login');
  }, [params.mode]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = useCallback(async () => {
    const e = email.trim();
    if (!e || !password) {
      Alert.alert('Missing fields', 'Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(e, password);
      router.replace('/');
    } catch (err) {
      Alert.alert('Sign in failed', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [email, password, router, signIn]);

  const onSignup = useCallback(async () => {
    const e = email.trim();
    if (!e || !password) {
      Alert.alert('Missing fields', 'Enter your email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp(e, password);
      router.replace('/verify-email' as Href);
    } catch (err) {
      Alert.alert('Sign up failed', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [email, password, router, signUp]);

  const leftPanel = (
    <View style={[styles.leftColumn, !split && styles.leftColumnCompact, split && styles.leftColumnSplit]}>
      <View style={[styles.heroWrap, !split && styles.heroWrapCompact, split && styles.heroWrapSplit]}>
        <Image
          source={getHeroSource()}
          style={styles.heroImage}
          resizeMode="cover"
          accessibilityLabel="Basketball court — sports action"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
          locations={[0, 0.45, 1]}
          style={styles.heroGradient}
          pointerEvents="none"
        />
        <View style={styles.heroCopy}>
          <Text style={styles.heroKicker}>PLAYBOOK</Text>
          <Text style={styles.heroTitle}>YOUR SEASON. ONE APP.</Text>
          <Text style={styles.heroSub}>
            Schedules, teams, leagues, and highlights — built for athletes who live for game day.
          </Text>
        </View>
      </View>
    </View>
  );

  const form = (
    <ScrollView
      style={[styles.formScroll, split && styles.formScrollSplit]}
      contentContainerStyle={styles.formInner}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.segment}>
        <Pressable
          onPress={() => setMode('login')}
          style={[styles.segmentItem, mode === 'login' && styles.segmentItemActive]}
        >
          <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>Log in</Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('signup')}
          style={[styles.segmentItem, mode === 'signup' && styles.segmentItemActive]}
        >
          <Text style={[styles.segmentText, mode === 'signup' && styles.segmentTextActive]}>Create account</Text>
        </Pressable>
      </View>

      <Text style={styles.formTitle}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</Text>
      <Text style={styles.formSubtitle}>
        {mode === 'login'
          ? 'Pick up where you left off — games, teams, and your profile are waiting.'
          : "Next, we'll build your player profile."}
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@school.edu"
        placeholderTextColor="rgba(15,23,42,0.45)"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={[styles.label, styles.labelSpaced]}>Password</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={styles.inputPassword}
          placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
          placeholderTextColor="rgba(15,23,42,0.45)"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable onPress={() => setShowPassword((s) => !s)} style={styles.eyeBtn} hitSlop={12}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#64748b" />
        </Pressable>
      </View>

      {mode === 'login' ? (
        <>
          <View style={styles.rowBetween}>
            <Pressable style={styles.rememberRow} onPress={() => setRemember((r) => !r)}>
              <View style={[styles.checkbox, remember && styles.checkboxOn]} />
              <Text style={styles.rememberLabel}>Remember me</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Reset password',
                  'Use Firebase Auth password reset from the console, or we can add an in-app reset flow next.'
                )
              }
            >
              <Text style={styles.link}>Forgot your password?</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 8 }}>
            <PrimaryButton
              title={loading ? 'Signing in…' : 'Log in'}
              onPress={onLogin}
              loading={loading}
            />
          </View>
        </>
      ) : (
        <View style={{ marginTop: 8 }}>
          <PrimaryButton
            title={loading ? 'Creating account…' : 'Continue'}
            onPress={onSignup}
            loading={loading}
          />
        </View>
      )}

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerOr}>Or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialStack}>
        <GoogleSignInButton appearance="onDark" />
        <Pressable
          style={({ pressed }) => [styles.socialApple, pressed && { opacity: 0.92 }]}
          onPress={() => Alert.alert('Coming soon', 'Sign in with Apple will be available in a future update.')}
        >
          <Ionicons name="logo-apple" size={22} color="#fff" />
          <Text style={styles.socialAppleText}>Sign in with Apple</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.socialFb, pressed && { opacity: 0.92 }]}
          onPress={() => Alert.alert('Coming soon', 'Sign in with Facebook will be available in a future update.')}
        >
          <Ionicons name="logo-facebook" size={22} color="#fff" />
          <Text style={styles.socialFbText}>Sign in with Facebook</Text>
        </Pressable>
      </View>

      <Text style={styles.switchHint}>
        {mode === 'login' ? (
          <>
            New to PlayBook?{' '}
            <Text style={styles.link} onPress={() => setMode('signup')}>
              Create an account
            </Text>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Text style={styles.link} onPress={() => setMode('login')}>
              Log in
            </Text>
          </>
        )}
      </Text>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {split ? (
        <View style={styles.splitRow}>
          {leftPanel}
          {form}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.stackScroll} keyboardShouldPersistTaps="handled">
          {leftPanel}
          {form}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const ink = brand.ink;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050508',
  },
  splitRow: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
  },
  stackScroll: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  leftColumn: {
    flex: 0.44,
    backgroundColor: '#020203',
    padding: 20,
    justifyContent: 'center',
  },
  leftColumnSplit: {
    minHeight: 520,
  },
  leftColumnCompact: {
    flex: undefined,
    width: '100%',
    padding: 16,
    paddingBottom: 8,
  },
  heroWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  heroWrapSplit: {
    flex: 1,
    minHeight: 440,
  },
  heroWrapCompact: {
    minHeight: 220,
    height: 240,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  heroCopy: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    zIndex: 2,
  },
  heroKicker: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 28,
    letterSpacing: 1,
    color: '#fff',
    lineHeight: 34,
    marginBottom: 10,
  },
  heroSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(244,246,255,0.78)',
    maxWidth: 360,
  },
  formScroll: {
    flex: 1,
    backgroundColor: ink,
  },
  formScrollSplit: {
    flex: 0.56,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  formInner: {
    paddingHorizontal: 28,
    paddingVertical: 32,
    paddingBottom: 48,
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentItemActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  segmentText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    color: 'rgba(244,246,255,0.5)',
  },
  segmentTextActive: {
    color: '#F4F6FF',
  },
  formTitle: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 28,
    color: '#F4F6FF',
    marginBottom: 8,
  },
  formSubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: brand.textMuted,
    lineHeight: 22,
    marginBottom: 28,
  },
  label: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    color: '#F4F6FF',
    marginBottom: 8,
  },
  labelSpaced: {
    marginTop: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: brand.cardBorder,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: 'rgba(228, 236, 255, 0.96)',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: brand.cardBorder,
    borderRadius: 22,
    backgroundColor: 'rgba(228, 236, 255, 0.96)',
    paddingRight: 8,
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: '#0f172a',
  },
  eyeBtn: {
    padding: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(244,246,255,0.35)',
  },
  checkboxOn: {
    backgroundColor: brand.blue,
    borderColor: brand.blue,
  },
  rememberLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: brand.textMuted,
  },
  link: {
    fontFamily: 'DMSans_600SemiBold',
    color: brand.blue,
    textDecorationLine: 'underline',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerOr: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: 'rgba(244,246,255,0.45)',
  },
  socialStack: {
    gap: 12,
  },
  socialApple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#000',
    borderRadius: 14,
    paddingVertical: 14,
  },
  socialAppleText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: '#fff',
  },
  socialFb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1877F2',
    borderRadius: 14,
    paddingVertical: 14,
  },
  socialFbText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: '#fff',
  },
  switchHint: {
    marginTop: 28,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: brand.textMuted,
    textAlign: 'center',
  },
});
