import { Redirect, type Href } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { brand } from '@/constants/theme';

/** Single gate for auth → onboarding → tabs. */
export default function WelcomeGate() {
  const { firebaseReady, user, loading, profile, profileLoading } = useAuth();

  if (!firebaseReady) return <Redirect href="/setup" />;

  if (loading || profileLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={brand.blue} />
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;
  if (!user.emailVerified) return <Redirect href={'/verify-email' as Href} />;
  if (!profile?.onboardingComplete) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: brand.ink, alignItems: 'center', justifyContent: 'center' },
});
