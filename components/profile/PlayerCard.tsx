import React, { useMemo } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { UserProfile } from '@/types';
import { SPORTS } from '@/constants/sports';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'PB';
  const a = parts[0]?.[0] ?? 'P';
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? 'B' : '';
  return (a + b).toUpperCase();
}

export function PlayerCard({
  profile,
  borderColor,
  size = 260,
}: {
  profile: UserProfile;
  borderColor: string;
  size?: number;
}) {
  const sport = SPORTS.find((s) => s.id === profile.primarySportId);
  const sportProfile = profile.sports?.find((s) => s.sportId === profile.primarySportId);
  const position = sportProfile?.positions?.[0] ?? '—';
  const level = sportProfile?.skillLevel ?? '—';
  const badgeTop = (profile.badges ?? []).slice(0, 3);

  const photo = profile.photoURL ? { uri: profile.photoURL } : { uri: `https://placehold.co/600x800/111827/ffffff?text=${initials(profile.displayName ?? 'PB')}` };

  const statRows = useMemo(
    () => [
      { k: 'SPORT', v: sport?.label ?? profile.primarySportId },
      { k: 'POS', v: position },
      { k: 'LEVEL', v: String(level).toUpperCase() },
      { k: 'ROLE', v: String(profile.role).toUpperCase() },
      { k: 'CITY', v: profile.location?.city ?? '—' },
      { k: 'BADGES', v: String((profile.badges ?? []).length) },
    ],
    [sport?.label, profile.primarySportId, position, level, profile.role, profile.location?.city, profile.badges]
  );

  const ovr = Math.min(99, Math.max(40, Math.round((profile.skillRatingAvg ?? 3.5) * 20)));

  return (
    <View style={[styles.stage, { width: size, height: size }]}>
      <View style={[styles.diamondOuter, { borderColor, width: size, height: size }]}>
        <View style={styles.diamondClip}>
          <View style={[styles.diamondRotate, { width: size, height: size }]}>
            <ImageBackground source={photo} style={styles.bg} resizeMode="cover">
              <LinearGradient
                colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.90)']}
                locations={[0, 0.55, 1]}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />

              <View style={styles.topRow}>
                <Text style={styles.kicker}>PLAYBOOK</Text>
                <View style={styles.ovrBox}>
                  <Text style={styles.ovrNum}>{ovr}</Text>
                  <Text style={styles.ovrLbl}>OVR</Text>
                </View>
              </View>

              <View style={styles.nameBlock}>
                <Text style={styles.name} numberOfLines={1}>
                  {profile.displayName ?? 'Athlete'}
                </Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {sport?.emoji ?? '🏟️'} {String(profile.primarySportId).toUpperCase()} · {String(position).toUpperCase()}
                </Text>
              </View>

              <View style={styles.statsOverlay}>
                <View style={styles.badgeRow}>
                  {badgeTop.length === 0 ? (
                    <Text style={styles.badgeMuted}>No badges</Text>
                  ) : (
                    badgeTop.map((b) => (
                      <View key={b.badgeId} style={styles.badgePill}>
                        <Text style={styles.badgeText}>{b.tier.replace(/_/g, ' ').toUpperCase()}</Text>
                      </View>
                    ))
                  )}
                </View>

                <View style={styles.statsGrid}>
                  {statRows.map((s) => (
                    <View key={s.k} style={styles.statCell}>
                      <Text style={styles.statKey}>{s.k}</Text>
                      <Text style={styles.statVal} numberOfLines={1}>
                        {s.v}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { alignSelf: 'center' },
  diamondOuter: {
    borderWidth: 4,
    borderRadius: 28,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  diamondClip: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  diamondRotate: {
    flex: 1,
    transform: [{ rotate: '45deg' }, { scale: 1.05 }],
  },
  bg: {
    flex: 1,
    transform: [{ rotate: '-45deg' }, { scale: 1.25 }],
    justifyContent: 'space-between',
    padding: 14,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kicker: { color: 'rgba(255,255,255,0.75)', fontSize: 11, letterSpacing: 1, fontFamily: 'DMSans_600SemiBold' },
  ovrBox: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
  },
  ovrNum: { color: '#fff', fontSize: 22, fontFamily: 'Oswald_700Bold', lineHeight: 24 },
  ovrLbl: { color: 'rgba(255,255,255,0.80)', fontSize: 10, fontFamily: 'DMSans_600SemiBold', letterSpacing: 1 },

  nameBlock: { marginTop: 10 },
  name: { color: '#fff', fontSize: 20, fontFamily: 'Oswald_700Bold', letterSpacing: 0.5 },
  sub: { marginTop: 2, color: 'rgba(255,255,255,0.78)', fontSize: 12, fontFamily: 'DMSans_600SemiBold' },

  statsOverlay: {
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  badgePill: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.10)' },
  badgeText: { color: 'rgba(255,255,255,0.88)', fontSize: 10, fontFamily: 'DMSans_600SemiBold' },
  badgeMuted: { color: 'rgba(255,255,255,0.60)', fontSize: 11, fontFamily: 'DMSans_400Regular' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  statCell: { width: '33.33%', paddingVertical: 6, paddingRight: 8 },
  statKey: { color: 'rgba(255,255,255,0.55)', fontSize: 10, fontFamily: 'DMSans_600SemiBold', letterSpacing: 0.8 },
  statVal: { marginTop: 3, color: '#fff', fontSize: 12, fontFamily: 'DMSans_600SemiBold' },
});

