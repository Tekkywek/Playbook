import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Switch,
  useWindowDimensions,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { brand } from '@/constants/theme';
import { SPORTS } from '@/constants/sports';
import { subscribeUpcomingGames, distanceMiles, joinGame } from '@/services/games';
import type { GameDoc, SkillLevel, SportId } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { runMatchmakerGames } from '@/services/ai';
import { GameMap } from '@/components/maps/GameMap';
import { fetchPracticeSpots, type PracticeSpot } from '@/services/places';
const SIDEBAR_W = 1024;

export default function GamesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const fabBottom = width >= SIDEBAR_W ? 24 : 88;
  const { user, profile } = useAuth();
  const { accent } = useTheme();
  const [games, setGames] = useState<GameDoc[]>([]);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [sport, setSport] = useState<SportId | 'all'>('all');
  const [radius, setRadius] = useState(25);
  const [skill, setSkill] = useState<SkillLevel | 'all'>('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [mapLayer, setMapLayer] = useState<'games' | 'spots' | 'both'>('both');
  const [spots, setSpots] = useState<PracticeSpot[]>([]);
  const [spotsLoading, setSpotsLoading] = useState(false);

  useEffect(() => {
    const u = subscribeUpcomingGames(setGames);
    return () => u();
  }, []);

  const filtered = useMemo(() => {
    const c = center ?? profile?.location;
    if (!c) return [];
    return games.filter((g) => {
      if (sport !== 'all' && g.sportId !== sport) return false;
      if (skill !== 'all' && g.minSkill !== skill) return false;
      if (freeOnly && g.entryFeeCents > 0) return false;
      const d = distanceMiles(c.lat, c.lng, g.lat, g.lng);
      if (d > radius) return false;
      return true;
    });
  }, [games, profile, center, sport, skill, freeOnly, radius]);

  const initialCenter = center ?? profile?.location ?? { lat: 37.55, lng: -122.0 };

  useEffect(() => {
    if (profile?.location && !center) {
      setCenter({ lat: profile.location.lat, lng: profile.location.lng });
    }
  }, [profile?.location?.lat, profile?.location?.lng]);

  useEffect(() => {
    const c = center ?? profile?.location;
    if (!c) return;
    let cancelled = false;
    setSpotsLoading(true);
    const t = setTimeout(() => {
      void fetchPracticeSpots(c.lat, c.lng, radius, sport)
        .then((items) => {
          if (!cancelled) setSpots(items);
        })
        .catch(() => {
          if (!cancelled) setSpots([]);
        })
        .finally(() => {
          if (!cancelled) setSpotsLoading(false);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [center?.lat, center?.lng, profile?.location?.lat, profile?.location?.lng, radius, sport]);

  const mapPins = useMemo(() => {
    const gamePins =
      mapLayer === 'spots'
        ? []
        : filtered.map((g) => ({
            id: `game-${g.id}`,
            lat: g.lat,
            lng: g.lng,
            title: g.title,
            color: accent,
          }));
    const spotPins =
      mapLayer === 'games'
        ? []
        : spots.map((s) => ({
            id: `spot-${s.id}`,
            lat: s.lat,
            lng: s.lng,
            title: `Practice: ${s.name}`,
            color: '#22c55e',
          }));
    return [...gamePins, ...spotPins];
  }, [mapLayer, filtered, spots, accent]);

  const onJoin = async (gameId: string) => {
    if (!user) return;
    try {
      await joinGame(gameId, user.uid);
      router.push(`/games/${gameId}`);
    } catch (e) {
      Alert.alert('Join', String(e));
    }
  };

  const runAi = async () => {
    if (!user) return;
    setAiOpen(true);
    setAiLoading(true);
    await runMatchmakerGames(user.uid);
    setAiLoading(false);
  };

  return (
    <DashboardShell active="pickup">
      <View style={styles.shellInner}>
      <View style={styles.head}>
        <Title style={styles.pageTitle}>Games</Title>
        <View style={styles.toggle}>
          <Pressable onPress={() => setView('map')} style={[styles.tcell, view === 'map' && { borderColor: accent }]}>
            <Body style={styles.toggleText}>Map</Body>
          </Pressable>
          <Pressable onPress={() => setView('list')} style={[styles.tcell, view === 'list' && { borderColor: accent }]}>
            <Body style={styles.toggleText}>List</Body>
          </Pressable>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 44, marginBottom: 8 }}>
        <Pressable onPress={() => setSport('all')} style={[styles.filterChip, sport === 'all' && { borderColor: accent }]}>
          <Label style={styles.filterLabel}>All sports</Label>
        </Pressable>
        {SPORTS.slice(0, 8).map((s) => (
          <Pressable key={s.id} onPress={() => setSport(s.id)} style={[styles.filterChip, sport === s.id && { borderColor: accent }]}>
            <Body style={styles.filterEmoji}>{s.emoji}</Body>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.filters}>
        <Body style={styles.filterText}>Radius {radius} mi</Body>
        <TextInput
          style={styles.smallInput}
          keyboardType="numeric"
          value={String(radius)}
          onChangeText={(t) => setRadius(Number(t) || 5)}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Body style={styles.filterText}>Free only</Body>
          <Switch value={freeOnly} onValueChange={setFreeOnly} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Body style={styles.filterText}>Layer</Body>
          <Pressable onPress={() => setMapLayer('games')} style={[styles.layerChip, mapLayer === 'games' && { borderColor: accent }]}>
            <Body style={styles.layerText}>Games</Body>
          </Pressable>
          <Pressable onPress={() => setMapLayer('spots')} style={[styles.layerChip, mapLayer === 'spots' && { borderColor: '#22c55e' }]}>
            <Body style={styles.layerText}>Practice</Body>
          </Pressable>
          <Pressable onPress={() => setMapLayer('both')} style={[styles.layerChip, mapLayer === 'both' && { borderColor: '#7C3AED' }]}>
            <Body style={styles.layerText}>Both</Body>
          </Pressable>
        </View>
      </View>

      {view === 'map' ? (
        <>
          <View style={styles.mapBox}>
            <GameMap
              initialCenter={initialCenter}
              accent={accent}
              radiusMiles={radius}
              onCenterChanged={setCenter}
              pins={mapPins}
            />
            <Pressable style={styles.expandBtn} onPress={() => setMapExpanded(true)}>
              <Body style={styles.expandBtnText}>Expand</Body>
            </Pressable>
          </View>

          <Modal visible={mapExpanded} animationType="slide">
            <View style={styles.mapModal}>
              <View style={styles.mapModalTop}>
                <Title style={styles.mapModalTitle}>Map</Title>
                <Pressable onPress={() => setMapExpanded(false)} style={styles.closeBtn}>
                  <Body style={styles.closeBtnText}>Close</Body>
                </Pressable>
              </View>
              <View style={styles.mapModalBody}>
                <GameMap
                  fill
                  initialCenter={initialCenter}
                  accent={accent}
                  radiusMiles={radius}
                  onCenterChanged={setCenter}
                  pins={mapPins}
                />
              </View>
            </View>
          </Modal>
        </>
      ) : null}

      {view === 'map' ? (
        <Body muted style={styles.spotsHint}>
          {spotsLoading
            ? 'Loading nearby practice spots...'
            : `${spots.length} practice spots found near this area.`}
        </Body>
      ) : null}

      <PrimaryButton title="Find My Perfect Game (AI)" onPress={runAi} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: fabBottom + 56 }}>
        {filtered.map((g) => {
              const d = profile?.location
                ? distanceMiles(profile.location.lat, profile.location.lng, g.lat, g.lng)
                : 0;
              const filled = g.players?.filter((p) => p.status === 'joined').length ?? 0;
              const emoji = SPORTS.find((s) => s.id === g.sportId)?.emoji ?? '🏟️';
              return (
                <Pressable key={g.id} onPress={() => router.push(`/games/${g.id}`)}>
                <LinearGradient colors={[brand.card, brand.inkSoft]} style={styles.card}>
                  <Body>
                    {emoji} {g.gameType.toUpperCase()} · {g.minSkill}
                  </Body>
                  <Title style={{ fontSize: 20, marginTop: 4 }}>{g.title}</Title>
                  <Body muted>
                    {g.locationLabel} · {d.toFixed(1)} mi · {g.startsAt.toDate().toLocaleString()}
                  </Body>
                  <Body style={{ marginTop: 6 }}>
                    {filled}/{g.playerLimit} players · {g.entryFeeCents ? `$${(g.entryFeeCents / 100).toFixed(0)}` : 'Free'}
                  </Body>
                  <PrimaryButton title="Join" onPress={() => onJoin(g.id)} />
                </LinearGradient>
                </Pressable>
              );
            })}
        {filtered.length === 0 ? (
          <Body muted style={styles.emptyList}>
            No games match filters — widen radius or create one.
          </Body>
        ) : null}
      </ScrollView>

      <Pressable style={[styles.fab, { bottom: fabBottom }]} onPress={() => router.push('/games/create')}>
        <Body style={{ color: '#fff', fontFamily: 'DMSans_600SemiBold' }}>+ Create</Body>
      </Pressable>

      <Modal visible={aiOpen} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalInner}>
            <Title>Matchmaker</Title>
            {aiLoading ? <ActivityIndicator color={accent} style={{ marginTop: 16 }} /> : <Body muted>Done — check home for picks.</Body>}
            <PrimaryButton title="Close" onPress={() => setAiOpen(false)} />
          </View>
        </View>
      </Modal>
      </View>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  shellInner: { flex: 1, paddingHorizontal: 16, paddingTop: 16, minHeight: 0 },
  pageTitle: { color: '#161b28' },
  toggleText: { fontSize: 13, color: '#161b28' },
  filterText: { fontSize: 12, color: '#161b28' },
  filterLabel: { fontSize: 10, color: 'rgba(22,27,40,0.55)' },
  filterEmoji: { fontSize: 12, color: '#161b28' },
  emptyList: { marginTop: 12, color: 'rgba(22,27,40,0.55)' },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  toggle: { flexDirection: 'row', gap: 8 },
  tcell: {
    borderWidth: 1,
    borderColor: '#dce1ee',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#dce1ee',
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    alignSelf: 'center',
  },
  filters: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' },
  layerChip: {
    borderWidth: 1,
    borderColor: '#dce1ee',
    borderRadius: 999,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  layerText: { fontSize: 11, color: '#161b28' },
  smallInput: {
    width: 48,
    backgroundColor: '#fff',
    color: '#161b28',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#dce1ee',
  },
  mapBox: { height: 220, borderRadius: 16, overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: brand.cardBorder },
  expandBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(15,23,42,0.82)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  expandBtnText: { color: 'rgba(255,255,255,0.95)', fontSize: 12, fontFamily: 'DMSans_600SemiBold' },
  mapModal: { flex: 1, backgroundColor: '#0B1020' },
  mapModalTop: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#0B1020',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.10)',
  },
  mapModalTitle: { color: '#fff', fontSize: 18 },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  closeBtnText: { color: '#fff', fontSize: 12, fontFamily: 'DMSans_600SemiBold' },
  mapModalBody: { flex: 1, padding: 12 },
  spotsHint: { marginBottom: 8, color: 'rgba(22,27,40,0.55)' },
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: brand.cardBorder,
    gap: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: brand.red,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalInner: { backgroundColor: brand.card, padding: 20, borderRadius: 16, gap: 12 },
});
