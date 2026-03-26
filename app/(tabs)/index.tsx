import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Modal, ActivityIndicator, Text, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { StatRingsRow } from '@/components/home/StatRings';
import { DashboardShell, dashPurple } from '@/components/dashboard/DashboardShell';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { brand } from '@/constants/theme';
import { greetingForNow, quoteForToday } from '@/constants/quotes';
import { SPORTS } from '@/constants/sports';
import { subscribeUpcomingGames, distanceMiles } from '@/services/games';
import { subscribeActivityFeed } from '@/services/activity';
import { fetchWeatherForecast, fetchWeatherNudge, type DayForecast, type HourForecast } from '@/services/weather';
import { runMatchmakerGames } from '@/services/ai';
import type { GameDoc } from '@/types';
import { WeatherForecastCard } from '@/components/home/WeatherForecastCard';

const ink = '#161b28';
const inkMuted = 'rgba(22,27,40,0.55)';
const cardBorder = '#dce1ee';

const SIDEBAR_W = 1024;

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const tabBarInset = width >= SIDEBAR_W ? 28 : 96;
  const { user, profile } = useAuth();
  const { accent } = useTheme();
  const [games, setGames] = useState<GameDoc[]>([]);
  const [activity, setActivity] = useState<{ id: string; title: string; subtitle?: string }[]>([]);
  const [weather, setWeather] = useState<string | null>(null);
  const [forecast, setForecast] = useState<{ hourly: HourForecast[]; daily: DayForecast[] } | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<{ id: string; matchPct: number; reason: string }[]>([]);

  useEffect(() => {
    const u = subscribeUpcomingGames(setGames);
    return () => u();
  }, []);

  useEffect(() => {
    if (!user) return;
    const u = subscribeActivityFeed(user.uid, (items) =>
      setActivity(items.map((x) => ({ id: x.id, title: x.title, subtitle: x.subtitle })))
    );
    return () => u();
  }, [user?.uid]);

  useEffect(() => {
    if (!profile?.location) return;
    let cancelled = false;

    const run = async () => {
      const loc = profile.location!;
      const [nextNudge, nextForecast] = await Promise.all([
        fetchWeatherNudge(loc.lat, loc.lng, loc.city),
        fetchWeatherForecast(loc.lat, loc.lng),
      ]);
      if (!cancelled) {
        setWeather(nextNudge);
        setForecast(nextForecast);
      }
    };

    void run();
    const id = setInterval(run, 10 * 60 * 1000); // refresh every 10 minutes
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [profile?.location?.lat, profile?.location?.lng, profile?.location?.city]);

  const sportLabel = SPORTS.find((s) => s.id === profile?.primarySportId)?.label ?? 'sport';

  const nextGame = useMemo(() => {
    if (!user || !profile?.location) return null;
    const joined = games.filter((g) => g.players?.some((p) => p.uid === user.uid && p.status === 'joined'));
    if (joined.length === 0) return null;
    joined.sort((a, b) => a.startsAt.toMillis() - b.startsAt.toMillis());
    return joined[0]!;
  }, [games, user, profile?.location]);

  const forYou = useMemo(() => {
    if (!profile?.location) return [];
    return games
      .filter((g) => g.sportId === profile.primarySportId && g.startsAt.toMillis() > Date.now())
      .map((g) => {
        const d = distanceMiles(profile.location!.lat, profile.location!.lng, g.lat, g.lng);
        const match = Math.max(60, 100 - Math.round(d * 3));
        return { g, d, match };
      })
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);
  }, [games, profile]);

  const winRate =
    profile && profile.gamesPlayed > 0
      ? Math.min(100, Math.round((profile.gamesWon / profile.gamesPlayed) * 100))
      : 0;

  const masteryLabel =
    profile && profile.gamesPlayed > 0 ? `${winRate}% season form` : 'Start your first game to track progress';

  const runAi = async () => {
    if (!user) return;
    setAiOpen(true);
    setAiLoading(true);
    try {
      const r = await runMatchmakerGames(user.uid);
      setAiResults(r);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <DashboardShell active="home">
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarInset }]}
      >
        <LinearGradient colors={[dashPurple, '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroBanner}>
          <Text style={styles.heroTag}>YOUR SEASON</Text>
          <Text style={styles.heroTitle}>Sharpen your skills with games, leagues, and coaching in one app.</Text>
          <Pressable onPress={() => router.push('/(tabs)/games')} style={styles.heroBtn}>
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={styles.heroBtnText}>Find pickup games</Text>
          </Pressable>
        </LinearGradient>

        <View style={styles.whiteCard}>
          <Text style={styles.eyebrow}>UNIT 1 · YOUR DASHBOARD</Text>
          <Title style={[styles.darkTitle, { marginTop: 6 }]}>
            {profile ? greetingForNow(profile.displayName) : 'Welcome'}
          </Title>
          <Text style={styles.subMuted}>{quoteForToday()}</Text>
          <View style={styles.masteryRow}>
            <Text style={styles.masteryLabel}>Season snapshot</Text>
            <View style={styles.masteryPill}>
              <Ionicons name="information-circle-outline" size={16} color={dashPurple} />
              <Text style={[styles.masteryPct, { color: dashPurple }]}>{masteryLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.sectionHead}>Today</Text>
          <Text style={styles.weatherLine}>{weather ?? 'Getting location-based weather…'}</Text>
          {profile?.streakCount ? (
            <View style={styles.streakBanner}>
              <Text style={styles.streakText}>
                You&apos;re on a {profile.streakCount}-game streak — keep showing up.
              </Text>
            </View>
          ) : null}
          {profile?.location && forecast ? (
            <View style={{ marginTop: 14 }}>
              <WeatherForecastCard cityLabel={profile.location.city} hourly={forecast.hourly} daily={forecast.daily} />
            </View>
          ) : null}
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.sectionHead}>Your numbers</Text>
          <View style={styles.ringsInset}>
            <StatRingsRow
              gamesPlayed={profile?.gamesPlayed ?? 0}
              winRate={winRate}
              reliability={profile?.reliabilityScore ?? 70}
              skill={profile?.skillRatingAvg ?? 3.5}
              accent={accent}
            />
          </View>
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.sectionHead}>Games & schedule</Text>
          <Text style={styles.sectionSub}>Videos and drills — tap to continue</Text>
          {nextGame ? (
            <LessonRow
              icon="play-circle"
              title={nextGame.title}
              subtitle={`Next ${sportLabel} · ${nextGame.startsAt.toDate().toLocaleString()}`}
              onPress={() => router.push(`/games/${nextGame.id}`)}
            />
          ) : (
            <LessonRow
              icon="calendar-outline"
              title={`No ${sportLabel} games scheduled`}
              subtitle="Create one or browse the map"
              onPress={() => router.push('/(tabs)/games')}
            />
          )}
          <LessonRow
            icon="map-outline"
            title="Browse games on the map"
            subtitle="Filter by sport, skill, and radius"
            onPress={() => router.push('/(tabs)/games')}
          />
          <LessonRow
            icon="sparkles-outline"
            title="AI matchmaker"
            subtitle="Find your best-fit pickup runs"
            onPress={runAi}
          />
        </View>

        <View style={styles.whiteCard}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.sectionHead}>Picks for you</Text>
            <Text style={styles.matchHint}>Match %</Text>
          </View>
          {forYou.length === 0 ? (
            <Text style={styles.emptyMuted}>No {sportLabel} games near you yet — be the first to host.</Text>
          ) : (
            forYou.map(({ g, d, match }) => (
              <Pressable key={g.id} onPress={() => router.push(`/games/${g.id}`)} style={styles.pickRow}>
                <View style={styles.pickMain}>
                  <Text style={styles.pickTitle}>{g.title}</Text>
                  <Text style={styles.pickSub}>
                    {g.locationLabel} · {d.toFixed(1)} mi
                  </Text>
                </View>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeText}>{match}%</Text>
                </View>
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.sectionHead}>Activity</Text>
          {activity.length === 0 ? (
            <Text style={styles.emptyMuted}>No recent activity — join a game to fill your feed.</Text>
          ) : (
            activity.map((a) => (
              <View key={a.id} style={styles.activityBlock}>
                <Text style={styles.activityTitle}>{a.title}</Text>
                {a.subtitle ? <Text style={styles.activitySub}>{a.subtitle}</Text> : null}
              </View>
            ))
          )}
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.sectionHead}>Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {(profile?.badges ?? []).slice(0, 6).map((b) => (
              <View key={b.badgeId} style={[styles.badgeTile, { borderColor: accent }]}>
                <Text style={styles.badgeTier}>{b.tier}</Text>
                <Text style={styles.badgeId}>{b.badgeId}</Text>
              </View>
            ))}
            {(profile?.badges ?? []).length === 0 ? (
              <Text style={styles.emptyMuted}>Earn badges by playing and staying reliable.</Text>
            ) : null}
          </ScrollView>
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.sectionHead}>Quick actions</Text>
          <View style={styles.qa}>
            <QuickChip icon="search" label="Find game" onPress={() => router.push('/(tabs)/games')} />
            <QuickChip icon="add-circle" label="Create" onPress={() => router.push('/games/create')} />
            <QuickChip icon="people" label="Teams" onPress={() => router.push('/(tabs)/teams')} />
            <QuickChip icon="person" label="Account" onPress={() => router.push('/(tabs)/profile')} />
          </View>
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>

      <Modal visible={aiOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Title style={{ fontSize: 22, color: ink }}>AI Matchmaker</Title>
            <Text style={styles.modalSub}>
              {aiLoading ? 'Analyzing nearby games…' : 'Curated matches for you.'}
            </Text>
            {aiLoading ? (
              <ActivityIndicator style={{ marginTop: 24 }} color={accent} />
            ) : (
              aiResults.map((r) => (
                <View key={r.id} style={styles.aiResult}>
                  <Text style={styles.aiPct}>{r.matchPct}% match</Text>
                  <Text style={styles.aiReason}>{r.reason}</Text>
                </View>
              ))
            )}
            <PrimaryButton title="Close" onPress={() => setAiOpen(false)} />
          </View>
        </View>
      </Modal>
    </DashboardShell>
  );
}

function LessonRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.lessonRow}>
      <View style={styles.lessonIcon}>
        <Ionicons name={icon} size={22} color={dashPurple} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.lessonTitle}>{title}</Text>
        {subtitle ? <Text style={styles.lessonSub}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={inkMuted} />
    </Pressable>
  );
}

function QuickChip({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.qaChip}>
      <Ionicons name={icon} size={22} color={dashPurple} />
      <Text style={styles.qaLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  heroBanner: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroTag: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 24,
    lineHeight: 30,
    color: '#fff',
    marginBottom: 18,
    maxWidth: 420,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    backgroundColor: '#0f172a',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  heroBtnText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: '#fff',
  },
  whiteCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: cardBorder,
  },
  eyebrow: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 10,
    letterSpacing: 1,
    color: inkMuted,
  },
  darkTitle: { color: ink, fontSize: 26 },
  subMuted: { marginTop: 8, fontFamily: 'DMSans_400Regular', fontSize: 14, color: inkMuted, lineHeight: 20 },
  masteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  masteryLabel: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: ink },
  masteryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(45,85,212,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  masteryPct: { fontFamily: 'DMSans_600SemiBold', fontSize: 12 },
  sectionHead: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 18,
    color: ink,
    letterSpacing: 0.3,
  },
  sectionSub: { marginTop: 4, fontFamily: 'DMSans_400Regular', fontSize: 13, color: inkMuted },
  weatherLine: { marginTop: 10, fontFamily: 'DMSans_600SemiBold', fontSize: 15, color: ink },
  streakBanner: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(229,57,53,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(229,57,53,0.2)',
  },
  streakText: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: ink },
  ringsInset: {
    marginTop: 12,
    backgroundColor: brand.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eef1f6',
    gap: 12,
  },
  lessonIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(45,85,212,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonTitle: { fontFamily: 'DMSans_600SemiBold', fontSize: 15, color: ink },
  lessonSub: { marginTop: 2, fontFamily: 'DMSans_400Regular', fontSize: 13, color: inkMuted },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchHint: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: inkMuted },
  emptyMuted: { marginTop: 8, fontFamily: 'DMSans_400Regular', fontSize: 14, color: inkMuted, lineHeight: 20 },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eef1f6',
    gap: 12,
  },
  pickMain: { flex: 1, minWidth: 0 },
  pickTitle: { fontFamily: 'DMSans_600SemiBold', fontSize: 15, color: ink },
  pickSub: { marginTop: 2, fontFamily: 'DMSans_400Regular', fontSize: 13, color: inkMuted },
  matchBadge: {
    backgroundColor: dashPurple,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  matchBadgeText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: '#fff' },
  activityBlock: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f4f6fb',
    borderWidth: 1,
    borderColor: cardBorder,
  },
  activityTitle: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, color: ink },
  activitySub: { marginTop: 4, fontFamily: 'DMSans_400Regular', fontSize: 13, color: inkMuted },
  badgeTile: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 10,
    padding: 8,
    backgroundColor: '#f8f9fc',
  },
  badgeTier: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: ink },
  badgeId: { fontFamily: 'DMSans_400Regular', fontSize: 10, marginTop: 4, color: inkMuted },
  qa: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  qaChip: {
    width: '22%',
    minWidth: 76,
    backgroundColor: '#f4f6fb',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cardBorder,
  },
  qaLabel: { fontSize: 11, marginTop: 6, textAlign: 'center', fontFamily: 'DMSans_600SemiBold', color: ink },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 12,
  },
  modalSub: { marginTop: 4, fontFamily: 'DMSans_400Regular', fontSize: 14, color: inkMuted },
  aiResult: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f4f6fb',
    borderWidth: 1,
    borderColor: cardBorder,
  },
  aiPct: { fontFamily: 'DMSans_600SemiBold', fontSize: 15, color: ink },
  aiReason: { marginTop: 4, fontFamily: 'DMSans_400Regular', fontSize: 13, color: inkMuted },
});
