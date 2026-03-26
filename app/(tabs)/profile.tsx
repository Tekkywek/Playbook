import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Switch,
  Pressable,
  Modal,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { PremiumModal } from '@/components/profile/PremiumModal';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { brand, getSportAccent } from '@/constants/theme';
import { SPORTS } from '@/constants/sports';
import { BADGE_CATALOG } from '@/constants/badges';
import { updateProfileFields, fetchRecentReviews, fetchHighlights } from '@/services/profile';
import { generateHighlightReelStub } from '@/services/ai';
import type { PlayerReview, HighlightClip } from '@/types';
import { useRouter } from 'expo-router';
import { registerPush } from '@/lib/push';
import { WebcamCaptureModal } from '@/components/profile/WebcamCaptureModal';
import { uploadProfileImage } from '@/services/storage';
import { PlayerCard } from '@/components/profile/PlayerCard';

const SIDEBAR_W = 1024;
const ink = '#161b28';
const inkMuted = 'rgba(22,27,40,0.62)';
const cardBorder = '#dce1ee';

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const bottomPad = width >= SIDEBAR_W ? 28 : 100;
  const { user, profile, signOut, mergeLocalProfile } = useAuth();
  const { accent } = useTheme();
  const router = useRouter();
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [reviews, setReviews] = useState<PlayerReview[]>([]);
  const [highlights, setHighlights] = useState<HighlightClip[]>([]);
  const [reelOpen, setReelOpen] = useState(false);
  const [reelBusy, setReelBusy] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    registerPush(user.uid).catch(() => {});
    fetchRecentReviews(user.uid).then(setReviews);
    fetchHighlights(user.uid).then(setHighlights);
  }, [user?.uid]);

  const sport = SPORTS.find((s) => s.id === profile?.primarySportId);
  const c = getSportAccent(profile?.primarySportId);

  const toggleScout = async (v: boolean) => {
    if (!user) return;
    await updateProfileFields(user.uid, { scoutingMode: v });
  };

  const runReel = async () => {
    setReelOpen(true);
    setReelBusy(true);
    try {
      await generateHighlightReelStub();
    } finally {
      setReelBusy(false);
    }
  };

  const rel = profile?.reliabilityScore ?? 70;
  const relColor = rel >= 80 ? brand.success : rel >= 60 ? brand.warn : brand.danger;

  const uidShort = user?.uid ? `${user.uid.slice(0, 6)}…${user.uid.slice(-4)}` : '—';
  const cardBorder = profile?.cardBorderColor ?? accent;

  const CARD_COLORS = ['#7C3AED', '#22c55e', '#06b6d4', '#f97316', '#ef4444', '#eab308', '#ffffff'];

  const applyPhotoUri = async (uri: string) => {
    if (!user) return;
    setPhotoBusy(true);
    try {
      const url = await uploadProfileImage(uri, user.uid);
      await updateProfileFields(user.uid, { photoURL: url });
    } catch (e) {
      Alert.alert('Photo', e instanceof Error ? e.message : String(e));
    } finally {
      if (Platform.OS === 'web' && uri.startsWith('blob:')) URL.revokeObjectURL(uri);
      setPhotoBusy(false);
    }
  };

  const openPhotoOptions = () => {
    if (Platform.OS === 'web') {
      setWebcamOpen(true);
      return;
    }
    Alert.alert('Profile photo', 'Choose a source', [
      { text: 'Camera', onPress: () => void pickCameraNative() },
      { text: 'Photo library', onPress: () => void pickLibraryNative() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const pickCameraNative = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera', 'Allow camera access to take a photo.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync(
      Platform.OS === 'web' ? { quality: 0.85 } : { quality: 0.85, allowsEditing: true, aspect: [1, 1] }
    );
    if (!res.canceled && res.assets[0]) await applyPhotoUri(res.assets[0].uri);
  };

  const pickLibraryNative = async () => {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!lib.granted) {
      Alert.alert('Photos', 'Allow library access to choose a photo.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync(
      Platform.OS === 'web' ? { quality: 0.85 } : { quality: 0.85, allowsEditing: true, aspect: [1, 1] }
    );
    if (!res.canceled && res.assets[0]) await applyPhotoUri(res.assets[0].uri);
  };

  return (
    <DashboardShell active="profile">
      <View style={{ flex: 1, minHeight: 0 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.accountCard}>
          <Text style={styles.accountEyebrow}>UNIT 5 · YOUR ACCOUNT</Text>
          <Text style={styles.accountTitle}>Sign-in & identity</Text>
          <Text style={styles.accountEmail}>{user?.email ?? 'Not signed in'}</Text>
          <Text style={styles.accountMeta}>User ID: {uidShort}</Text>
          <Text style={styles.accountHint}>
            Your email and password are stored with Firebase. Sign out below if you need to switch accounts, then use
            Log in with the same email and password to return to this profile.
          </Text>
        </View>

        <LinearGradient colors={[c + '55', brand.inkSoft]} style={styles.hero}>
          <Pressable onPress={openPhotoOptions} disabled={photoBusy} style={styles.avatarPress}>
            <Image
              source={{
                uri: profile?.photoURL ?? 'https://placehold.co/120x120/151D33/fff?text=PB',
              }}
              style={styles.avatar}
            />
            {photoBusy ? (
              <View style={styles.avatarBusy}>
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <View style={styles.avatarEditBadge}>
                <Text style={styles.avatarEditText}>{Platform.OS === 'web' ? 'Webcam' : 'Change'}</Text>
              </View>
            )}
          </Pressable>
          <Title style={{ marginTop: 12 }}>{profile?.displayName ?? 'Athlete'}</Title>
          <Body muted>
            {sport?.emoji} {sport?.label} · {profile?.role} · {profile?.ageGroup?.replace(/_/g, ' ')}
          </Body>
          {profile?.location?.city ? <Body muted>{profile.location.city}</Body> : null}
        </LinearGradient>

        <View style={[styles.card, { borderColor: relColor }]}>
          <Label>Reliability</Label>
          <Title style={{ fontSize: 42, color: relColor }}>{rel}</Title>
          <Body muted>
            {profile?.gamesNoShow ? `${profile.gamesNoShow} no-shows` : 'Clean attendance history'}
          </Body>
        </View>

        <Pressable onPress={() => router.push('/premium')} style={styles.tradingCard}>
          <Body style={{ fontSize: 10, color: brand.textMuted }}>ATHLETE CARD</Body>
          <Title style={{ fontSize: 22, marginTop: 4 }}>{profile?.displayName}</Title>
          <Body>
            {sport?.label} · {rel} REL · ★ {profile?.skillRatingAvg?.toFixed(1) ?? '—'} skill
          </Body>
          <Body muted style={{ marginTop: 8 }}>
            Tap for full-screen card & share (image export hooks to expo-sharing).
          </Body>
        </Pressable>

        {profile ? (
          <View style={{ marginTop: 14 }}>
            <PlayerCard profile={profile} borderColor={cardBorder} size={300} variant="full" />
            <View style={styles.cardCustomizer}>
              <Body style={styles.customLabel}>Card border</Body>
              <View style={styles.colorRow}>
                {CARD_COLORS.map((c0) => {
                  const selected = (profile.cardBorderColor ?? accent) === c0;
                  return (
                    <Pressable
                      key={c0}
                      onPress={() => mergeLocalProfile({ cardBorderColor: c0 })}
                      style={[
                        styles.colorDot,
                        { backgroundColor: c0 === '#ffffff' ? '#fff' : c0, borderColor: '#dce1ee' },
                        selected && { transform: [{ scale: 1.08 }], borderColor: ink },
                      ]}
                    />
                  );
                })}
              </View>
              <Body muted style={styles.customHint}>
                This is saved on this device for now.
              </Body>
            </View>
          </View>
        ) : null}

        <View style={styles.grid2}>
          <StatBox label="Games" value={String(profile?.gamesPlayed ?? 0)} />
          <StatBox
            label="Win %"
            value={
              profile && profile.gamesPlayed > 0
                ? `${Math.round((profile.gamesWon / profile.gamesPlayed) * 100)}%`
                : '—'
            }
          />
          <StatBox label="Skill" value={profile?.skillRatingAvg?.toFixed(1) ?? '—'} />
          <StatBox label="Teams" value={String(profile?.teamsCount ?? 0)} />
        </View>

        <View style={styles.rowBetween}>
          <Body style={{ fontFamily: 'DMSans_600SemiBold' }}>Scouting mode</Body>
          <Switch value={profile?.scoutingMode ?? false} onValueChange={toggleScout} />
        </View>
        <Body muted>Discoverable to college scouts — you&apos;ll get notified when they view you.</Body>

        <PrimaryButton title="Go Premium" onPress={() => setPremiumOpen(true)} />
        <View style={{ height: 8 }} />
        <PrimaryButton title="Sign out" onPress={() => signOut()} accent={brand.card} />

        <Label style={{ marginTop: 24 }}>Badge wall</Label>
        <View style={styles.badgeWall}>
          {BADGE_CATALOG.slice(0, 12).map((b) => {
            const earned = profile?.badges?.find((x) => x.badgeId === b.id);
            const locked = !earned;
            return (
              <View key={b.id} style={[styles.badgeCell, locked && { opacity: 0.35 }]}>
                <Body style={{ fontSize: 10 }}>{b.name}</Body>
                <Body muted style={{ fontSize: 9, marginTop: 4 }}>
                  {earned ? earned.tier : 'Locked'}
                </Body>
              </View>
            );
          })}
        </View>

        <View style={styles.rowBetween}>
          <Label>Highlights</Label>
          {profile?.premiumTier === 'athlete_pro' ||
          profile?.premiumTier === 'coach_pro' ||
          profile?.premiumTier === 'club_elite' ? (
            <PrimaryButton title="Auto-generate reel" onPress={runReel} />
          ) : (
            <Body muted>Pro feature</Body>
          )}
        </View>
        <View style={styles.hlGrid}>
          {highlights.map((h) => (
            <View key={h.id} style={styles.hl}>
              <Body style={{ fontSize: 10 }}>{h.views} views</Body>
            </View>
          ))}
          {highlights.length === 0 ? <Body muted>No clips yet — upload from the coach console soon.</Body> : null}
        </View>

        <Label style={{ marginTop: 20 }}>Reviews</Label>
        {reviews.map((r) => (
          <View key={r.id} style={styles.review}>
            <Body>
              ★{r.skillStars} skill · ★{r.reliabilityStars} reliability
            </Body>
            {r.comment ? <Body muted>{r.comment}</Body> : null}
          </View>
        ))}
        {reviews.length === 0 ? <Body muted>No public reviews yet.</Body> : null}
      </ScrollView>

      <WebcamCaptureModal
        visible={webcamOpen}
        onClose={() => setWebcamOpen(false)}
        onCapture={(uri) => void applyPhotoUri(uri)}
      />

      <PremiumModal visible={premiumOpen} onClose={() => setPremiumOpen(false)} />

      <Modal visible={reelOpen} transparent animationType="fade">
        <View style={styles.reelBg}>
          <View style={styles.reelCard}>
            <Title>Highlight reel</Title>
            {reelBusy ? (
              <ActivityIndicator color={accent} style={{ marginVertical: 20 }} />
            ) : (
              <Body>Your auto-cut reel is ready — cinematic crop, beat-synced (stub).</Body>
            )}
            <PrimaryButton title="Close" onPress={() => setReelOpen(false)} />
          </View>
        </View>
      </Modal>
      </View>
    </DashboardShell>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Label style={{ fontSize: 9 }}>{label}</Label>
      <Title style={{ fontSize: 22, marginTop: 4 }}>{value}</Title>
    </View>
  );
}

const styles = StyleSheet.create({
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: cardBorder,
  },
  accountEyebrow: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 10,
    letterSpacing: 1,
    color: inkMuted,
  },
  accountTitle: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 20,
    color: ink,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  accountEmail: {
    marginTop: 10,
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
    color: ink,
  },
  accountMeta: {
    marginTop: 6,
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: inkMuted,
  },
  accountHint: {
    marginTop: 12,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: inkMuted,
  },
  hero: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  avatarPress: {
    position: 'relative',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: '#fff3',
  },
  avatarBusy: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 56,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  avatarEditText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    backgroundColor: brand.card,
  },
  tradingCard: {
    marginTop: 16,
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#11182A',
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  cardCustomizer: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: brand.cardBorder,
    padding: 12,
  },
  customLabel: { fontFamily: 'DMSans_600SemiBold', color: ink, fontSize: 13 },
  customHint: { marginTop: 10, color: inkMuted, fontSize: 12 },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  colorDot: {
    width: 26,
    height: 26,
    borderRadius: 999,
    borderWidth: 2,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  statBox: {
    width: '47%',
    backgroundColor: brand.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  badgeWall: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  badgeCell: {
    width: '30%',
    minWidth: 100,
    backgroundColor: brand.card,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  hlGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  hl: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: brand.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  review: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: brand.card,
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  reelBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  reelCard: {
    backgroundColor: brand.card,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
});
