import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { SPORTS } from '@/constants/sports';

/** Course-style dashboard purple (reference UI) */
export const dashPurple = '#6347D1';
export const dashPurpleSoft = '#E8E4FA';
export const dashBg = '#F4F6FB';
export const dashInk = '#0f172a';
export const dashMuted = '#64748b';

export type DashboardNavKey =
  | 'home'
  | 'pickup'
  | 'league'
  | 'coaching'
  | 'coming_soon'
  | 'settings'
  | 'profile';

const WIDE = 1024;

const MAIN_NAV: {
  key: DashboardNavKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
}[] = [
  { key: 'home', label: 'Home', icon: 'grid-outline', href: '/(tabs)' },
  { key: 'pickup', label: 'Pickup', icon: 'location-outline', href: '/(tabs)/games' },
  { key: 'league', label: 'League', icon: 'trophy-outline', href: '/(tabs)/leagues' },
  { key: 'coaching', label: 'Coaching', icon: 'school-outline', href: '/(tabs)/teams' },
  { key: 'coming_soon', label: 'Coming soon', icon: 'hourglass-outline', href: '/(tabs)/coming-soon' },
];

export function DashboardShell({
  active,
  children,
}: {
  active: DashboardNavKey;
  children: React.ReactNode;
}) {
  const { width } = useWindowDimensions();
  const wide = width >= WIDE;
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const sport = SPORTS.find((s) => s.id === profile?.primarySportId);
  const displayName = profile?.displayName ?? user?.email?.split('@')[0] ?? 'Athlete';
  const photoUrl = profile?.photoURL ?? user?.photoURL ?? 'https://placehold.co/160x160/6347D1/ffffff?text=PB';
  const completionPct = Math.min(
    100,
    28 +
      (profile?.displayName ? 18 : 0) +
      (profile?.photoURL ? 15 : 0) +
      Math.min(39, (profile?.gamesPlayed ?? 0) * 3)
  );

  const showRight = wide && active !== 'profile';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.body}>
        {wide ? (
          <View style={styles.left}>
            <Pressable onPress={() => router.push('/(tabs)')} style={styles.logoRow}>
              <LinearGradient colors={[dashPurple, '#7C3AED']} style={styles.logoMark}>
                <Ionicons name="star" size={18} color="#fff" />
              </LinearGradient>
              <Text style={styles.logoWord}>PlayBook</Text>
            </Pressable>

            <Text style={styles.navSectionLabel}>MAIN</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.navScroll}>
              {MAIN_NAV.map((item) => {
                const on = active === item.key;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => router.push(item.href as never)}
                    style={[styles.navItem, on && styles.navItemOn]}
                  >
                    {on ? <View style={styles.navAccent} /> : <View style={styles.navAccentSpacer} />}
                    <Ionicons name={item.icon} size={20} color={on ? dashPurple : dashMuted} />
                    <Text style={[styles.navLabel, on && styles.navLabelOn]}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={[styles.navSectionLabel, styles.settingsHead]}>SETTINGS</Text>
            <Pressable
              onPress={() => router.push('/(tabs)/settings' as never)}
              style={[styles.navItem, active === 'settings' && styles.navItemOn]}
            >
              {active === 'settings' ? <View style={styles.navAccent} /> : <View style={styles.navAccentSpacer} />}
              <Ionicons name="settings-outline" size={20} color={active === 'settings' ? dashPurple : dashMuted} />
              <Text style={[styles.navLabel, active === 'settings' && styles.navLabelOn]}>Settings</Text>
            </Pressable>
            <Pressable onPress={() => signOut()} style={styles.logoutRow}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.centerCol}>
          {wide ? (
            <Pressable onPress={() => router.push('/(tabs)/games')} style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={dashMuted} />
              <Text style={styles.searchPlaceholder}>Search games, leagues, teams…</Text>
              <Ionicons name="options-outline" size={20} color={dashMuted} />
            </Pressable>
          ) : null}
          <View style={styles.main}>{children}</View>
        </View>

        {showRight ? (
          <View style={styles.right}>
            <View style={styles.rightHeader}>
              <Text style={styles.rightTitle}>Your profile</Text>
              <Pressable onPress={() => router.push('/(tabs)/profile')} hitSlop={8}>
                <Ionicons name="ellipsis-horizontal" size={22} color={dashMuted} />
              </Pressable>
            </View>

            <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.avatarBlock}>
              <View style={[styles.avatarRing, { borderColor: dashPurple }]}>
                <Image source={{ uri: photoUrl }} style={styles.avatarImg} />
              </View>
              <Text style={styles.ringHint}>{completionPct}% complete</Text>
            </Pressable>

            <Text style={styles.greet}>Good day, {displayName.split(' ')[0]}</Text>
            <Text style={styles.greetSub}>Continue your season — games, teams, and goals in one place.</Text>

            <View style={styles.quickRow}>
              <Pressable style={styles.quickIcon} onPress={() => router.push('/notifications')}>
                <Ionicons name="notifications-outline" size={20} color={dashPurple} />
              </Pressable>
              <Pressable style={styles.quickIcon} onPress={() => router.push('/(tabs)/games')}>
                <Ionicons name="search-outline" size={20} color={dashPurple} />
              </Pressable>
            </View>

            <Text style={styles.activityLabel}>Activity</Text>
            <View style={styles.bars}>
              {[0.35, 0.55, 0.45, 0.75, 0.5, 0.65, 0.85].map((h, i) => (
                <View key={i} style={[styles.bar, { height: 8 + h * 36, backgroundColor: i % 2 === 0 ? dashPurple : '#9B87E8' }]} />
              ))}
            </View>

            <Text style={styles.miniStat}>
              {sport?.emoji} {sport?.label ?? 'Sport'} · {profile?.gamesPlayed ?? 0} games
            </Text>

            <Pressable style={styles.seeProfile} onPress={() => router.push('/(tabs)/profile')}>
              <Text style={styles.seeProfileText}>Open full profile</Text>
              <Ionicons name="chevron-forward" size={18} color={dashPurple} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: dashBg,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 0,
  },
  left: {
    width: 260,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWord: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 22,
    color: dashPurple,
    letterSpacing: 0.5,
  },
  navSectionLabel: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.2,
    color: dashMuted,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  settingsHead: {
    marginTop: 20,
  },
  navScroll: {
    paddingHorizontal: 10,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    position: 'relative',
  },
  navItemOn: {
    backgroundColor: dashPurpleSoft,
  },
  navAccent: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
    backgroundColor: dashPurple,
  },
  navAccentSpacer: {
    width: 3,
  },
  navLabel: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: dashMuted,
  },
  navLabelOn: {
    color: dashPurple,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 22,
    marginTop: 8,
    paddingVertical: 12,
  },
  logoutText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: '#DC2626',
  },
  centerCol: {
    flex: 1,
    minWidth: 0,
    backgroundColor: dashBg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: '#94a3b8',
  },
  main: {
    flex: 1,
    minHeight: 0,
  },
  right: {
    width: 300,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
  },
  rightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rightTitle: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 18,
    color: dashInk,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  ringHint: {
    marginTop: 8,
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
    color: dashPurple,
  },
  greet: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 20,
    color: dashInk,
    textAlign: 'center',
  },
  greetSub: {
    marginTop: 6,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: dashMuted,
    textAlign: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: dashPurpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityLabel: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.8,
    color: dashMuted,
    marginBottom: 10,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 52,
    marginBottom: 16,
    gap: 4,
  },
  bar: {
    flex: 1,
    borderRadius: 6,
    minHeight: 10,
  },
  miniStat: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: dashMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  seeProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: dashPurpleSoft,
  },
  seeProfileText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: dashPurple,
  },
});
