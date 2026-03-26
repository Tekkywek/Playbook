import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { brand, getSportAccent } from '@/constants/theme';
import { SPORTS, POSITIONS_BY_SPORT } from '@/constants/sports';
import type { AgeGroup, SkillLevel, SportId, UserGoal, UserRole, SportProfile } from '@/types';
import { completeOnboarding, updateProfileFields } from '@/services/profile';
import { uploadProfileImage } from '@/services/storage';
import { WebcamCaptureModal } from '@/components/profile/WebcamCaptureModal';

/** Nominatim requires a descriptive User-Agent per usage policy. */
const NOMINATIM_UA = 'PlayBook/1.0 (student project; not a bulk crawler)';
const GEO_FETCH_MS = 18000;

async function fetchJsonWithTimeout(
  url: string,
  headers: Record<string, string>
): Promise<Response> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), GEO_FETCH_MS);
  try {
    return await fetch(url, { headers, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error(`${label} timed out`)), ms)
    ),
  ]);
}

function notifyUser(title: string, body?: string) {
  const msg = body ? `${title}\n\n${body}` : title;
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.alert(msg);
  } else {
    Alert.alert(title, body);
  }
}

async function reverseGeocodeNominatim(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetchJsonWithTimeout(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { 'User-Agent': NOMINATIM_UA, 'Accept-Language': 'en' }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: Record<string, string>;
      display_name?: string;
    };
    const a = data.address;
    if (a) {
      const city = a.city || a.town || a.village || a.hamlet || a.county || '';
      const region = a.state || a.region || '';
      const line = [city, region].filter(Boolean).join(', ');
      if (line) return line;
    }
    if (data.display_name) return data.display_name.split(',').slice(0, 2).join(',').trim();
    return null;
  } catch {
    return null;
  }
}

async function geocodeCityNominatim(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetchJsonWithTimeout(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { 'User-Agent': NOMINATIM_UA }
    );
    if (!res.ok) return null;
    const arr = (await res.json()) as { lat: string; lon: string }[];
    if (!arr?.[0]) return null;
    return { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon) };
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') return null;
    return null;
  }
}

const SKILL: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'elite'];
const TOTAL_STEPS = 5;

const GOALS: { id: UserGoal; label: string; hint: string }[] = [
  { id: 'pickup', label: 'Find pickup games', hint: 'Discover runs near you' },
  { id: 'league', label: 'Join a league', hint: 'Structured seasons' },
  { id: 'recruited', label: 'Get recruited', hint: 'Visibility to scouts' },
  { id: 'manage_team', label: 'Manage a team', hint: 'Rosters & schedules' },
  { id: 'coach_team', label: 'Coach a team', hint: 'Lead practices & games' },
  { id: 'stats', label: 'Track my stats', hint: 'Performance over time' },
  { id: 'all', label: 'All of the above', hint: 'Full platform' },
];

const AGE: { id: AgeGroup; label: string }[] = [
  { id: 'youth_u12', label: 'Youth U12' },
  { id: 'youth_u14', label: 'Youth U14' },
  { id: 'youth_u16', label: 'Youth U16' },
  { id: 'youth_u18', label: 'Youth U18' },
  { id: 'high_school', label: 'High School' },
  { id: 'college', label: 'College' },
  { id: 'adult_rec', label: 'Adult Rec' },
  { id: 'adult_competitive', label: 'Adult Competitive' },
  { id: 'pro', label: 'Pro / Semi-Pro' },
];

const ROLES: { id: UserRole; label: string; desc: string }[] = [
  { id: 'player', label: 'Player', desc: 'Join games and teams as an athlete' },
  { id: 'coach', label: 'Coach', desc: 'Lead teams, rosters, and schedules' },
  { id: 'both', label: 'Both', desc: 'Play and coach in the community' },
];

const STEP_COPY: { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  {
    title: 'Your identity',
    subtitle: 'Add your name and a photo — this is how teammates recognize you in PlayBook.',
    icon: 'person-outline',
  },
  {
    title: 'Your sports',
    subtitle: 'Select every sport you play. The first one you tap becomes your primary sport for theming.',
    icon: 'basketball-outline',
  },
  {
    title: 'Positions & skill',
    subtitle: 'Fine-tune each sport like a player card — positions and skill level.',
    icon: 'ribbon-outline',
  },
  {
    title: 'Role & age group',
    subtitle: 'Tell us how you show up and which age bracket you compete in.',
    icon: 'people-outline',
  },
  {
    title: 'Location & goals',
    subtitle: 'We use your area for nearby games and weather — we never sell your data.',
    icon: 'location-outline',
  },
];

function ProgressBar({ current }: { current: number }) {
  return (
    <View style={styles.progressTrack}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View key={i} style={[styles.progressSeg, i <= current && styles.progressSegOn]} />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const { user, mergeLocalProfile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [selectedSports, setSelectedSports] = useState<SportId[]>([]);
  const [sportProfiles, setSportProfiles] = useState<Partial<Record<SportId, SportProfile>>>({});
  const [role, setRole] = useState<UserRole>('player');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('high_school');
  const [city, setCity] = useState('');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);

  const primarySport = selectedSports[0] ?? 'soccer';

  const toggleSport = (id: SportId) => {
    setSelectedSports((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((s) => s !== id);
        setSportProfiles((sp) => {
          const { [id]: _, ...rest } = sp;
          return rest;
        });
        return next;
      }
      setSportProfiles((sp) => ({
        ...sp,
        [id]: {
          sportId: id,
          positions: [POSITIONS_BY_SPORT[id][0]!],
          skillLevel: 'intermediate',
        },
      }));
      return [...prev, id];
    });
  };

  const updateSport = (id: SportId, patch: Partial<SportProfile>) => {
    setSportProfiles((sp) => ({
      ...sp,
      [id]: { ...(sp[id] as SportProfile), sportId: id, ...patch } as SportProfile,
    }));
  };

  const pickPhoto = async () => {
    if (Platform.OS === 'web') {
      setWebcamOpen(true);
      return;
    }
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera', 'Allow camera access to take a profile photo.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.85, allowsEditing: true, aspect: [1, 1] });
    if (!res.canceled) setPhotoUri(res.assets[0]!.uri);
  };

  const pickLibrary = async () => {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!lib.granted) {
      Alert.alert('Photos', 'Allow photo library access to choose a profile picture.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync(
      Platform.OS === 'web'
        ? { quality: 0.85 }
        : { quality: 0.85, allowsEditing: true, aspect: [1, 1] }
    );
    if (!res.canceled) setPhotoUri(res.assets[0]!.uri);
  };

  const locate = async () => {
    setLocating(true);
    try {
      if (Platform.OS === 'web') {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
          notifyUser('Location', 'Geolocation is not available in this browser.');
          return;
        }
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0,
          });
        });
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatLng({ lat, lng });
        const label = await reverseGeocodeNominatim(lat, lng);
        setCity(label ?? `Near ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`);
        return;
      }

      let granted = false;
      try {
        const fg = await Location.requestForegroundPermissionsAsync();
        granted = fg.granted;
      } catch {
        granted = true;
      }
      if (!granted) {
        notifyUser('Location', 'Allow location access so we can find games and weather near you.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLatLng({ lat, lng });
      try {
        const rev = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        const first = rev[0];
        setCity(first ? [first.city, first.region].filter(Boolean).join(', ') || 'Your area' : 'Your area');
      } catch {
        setCity('Your area');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      notifyUser('Location', msg.includes('denied') ? 'Location was blocked. Allow location in your browser settings.' : msg);
    } finally {
      setLocating(false);
    }
  };

  const sportsPayload: SportProfile[] = useMemo(() => {
    return selectedSports.map((id) => sportProfiles[id] as SportProfile).filter(Boolean);
  }, [selectedSports, sportProfiles]);

  const finish = async () => {
    if (!user) return;
    if (!name.trim()) {
      notifyUser('Name', 'Add your name.');
      return;
    }
    if (selectedSports.length === 0) {
      notifyUser('Sports', 'Pick at least one sport.');
      return;
    }

    let finalLat = latLng?.lat;
    let finalLng = latLng?.lng;
    let finalCity = city.trim();

    setSaving(true);
    try {
      if (finalLat != null && finalLng != null) {
        if (!finalCity) finalCity = 'Your area';
      } else if (finalCity.length > 0) {
        if (Platform.OS === 'web') {
          let g: { lat: number; lng: number } | null = null;
          try {
            g = await withTimeout(geocodeCityNominatim(finalCity), 25000, 'Location lookup');
          } catch {
            g = null;
          }
          if (!g) {
            notifyUser(
              'Location',
              'Could not find that place or the lookup timed out. Try a nearby city or tap “Use my current location”.'
            );
            return;
          }
          finalLat = g.lat;
          finalLng = g.lng;
        } else {
          try {
            const g = await Location.geocodeAsync(finalCity);
            if (!g?.[0]) {
              notifyUser('Location', 'Could not find that address. Try again or use your current location.');
              return;
            }
            finalLat = g[0].latitude;
            finalLng = g[0].longitude;
          } catch {
            notifyUser('Location', 'Could not look up that city. Use your current location or try another city.');
            return;
          }
        }
      } else {
        notifyUser('Location', 'Set your area: tap “Use my current location” or type your city.');
        return;
      }

      // Save Firestore first; upload new photo after navigation so Storage/web fetch can’t block the dashboard.
      const onboardingPayload = {
        displayName: name.trim(),
        photoURL: user.photoURL,
        sports: sportsPayload,
        primarySportId: primarySport,
        role,
        ageGroup,
        location: { city: finalCity, lat: finalLat!, lng: finalLng! },
        goals: goals.length ? goals : (['pickup'] as UserGoal[]),
      };
      await withTimeout(completeOnboarding(user.uid, onboardingPayload), 45000, 'Saving profile');

      mergeLocalProfile({ ...onboardingPayload, onboardingComplete: true });
      // Let React commit auth profile before navigating (avoids index/tabs seeing stale `onboardingComplete`).
      if (Platform.OS === 'web' && typeof requestAnimationFrame !== 'undefined') {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        });
      } else {
        await new Promise<void>((r) => setTimeout(r, 0));
      }

      router.replace('/(tabs)' as Href);

      if (photoUri) {
        void (async () => {
          try {
            const url = await uploadProfileImage(photoUri, user.uid);
            await updateProfileFields(user.uid, { photoURL: url });
            mergeLocalProfile({ photoURL: url });
          } catch {
            /* photo is optional; profile already saved */
          }
        })();
      }
    } catch (e) {
      notifyUser('Could not save', String(e));
    } finally {
      setSaving(false);
    }
  };

  const meta = STEP_COPY[step]!;
  const accent = getSportAccent(primarySport);

  return (
    <LinearGradient colors={['#070b14', '#0B1020', '#0a1220']} locations={[0, 0.45, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safeTop} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerBlock}>
              <ProgressBar current={step} />
              <View style={styles.stepLabelRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>
                    STEP {step + 1} / {TOTAL_STEPS}
                  </Text>
                </View>
                <Ionicons name={meta.icon} size={22} color={accent} />
              </View>
              <Title style={styles.stepTitle}>{meta.title}</Title>
              <Text style={styles.stepSubtitle}>{meta.subtitle}</Text>
            </View>

            <View style={styles.card}>
              {step === 0 && (
                <>
                  <Text style={styles.fieldLabel}>Display name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Alex Morgan"
                    placeholderTextColor="rgba(244,246,255,0.35)"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />

                  <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>Profile photo</Text>
                  <Text style={styles.fieldHint}>Optional — you can add or change this anytime.</Text>

                  <View style={styles.photoBlock}>
                    <View style={styles.avatarRing}>
                      <LinearGradient
                        colors={photoUri ? [accent + '99', accent + '44'] : ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']}
                        style={styles.avatarRingGrad}
                      >
                        {photoUri ? (
                          <Image source={{ uri: photoUri }} style={styles.avatarImg} />
                        ) : (
                          <View style={styles.avatarPlaceholder}>
                            <Ionicons name="camera-outline" size={36} color="rgba(244,246,255,0.45)" />
                            <Text style={styles.avatarPhText}>Add photo</Text>
                          </View>
                        )}
                      </LinearGradient>
                    </View>

                    <View style={styles.photoActions}>
                      <Pressable onPress={pickPhoto} style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.85 }]}>
                        <Ionicons name="camera" size={18} color={brand.text} />
                        <Text style={styles.outlineBtnText}>{Platform.OS === 'web' ? 'Use webcam' : 'Take photo'}</Text>
                      </Pressable>
                      <Pressable onPress={pickLibrary} style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.85 }]}>
                        <Ionicons name="images-outline" size={18} color={brand.text} />
                        <Text style={styles.outlineBtnText}>Upload from library</Text>
                      </Pressable>
                    </View>
                  </View>
                </>
              )}

              {step === 1 && (
                <View style={styles.sportGrid}>
                  {SPORTS.map((s) => {
                    const on = selectedSports.includes(s.id);
                    const a = getSportAccent(s.id);
                    return (
                      <Pressable
                        key={s.id}
                        onPress={() => toggleSport(s.id)}
                        style={styles.sportTile}
                      >
                        <LinearGradient
                          colors={
                            on ? [a + '4d', brand.card] : [brand.card, brand.inkSoft]
                          }
                          style={[styles.sportTileInner, on && { borderColor: a, borderWidth: 2 }]}
                        >
                          {on ? (
                            <View style={[styles.checkDot, { backgroundColor: a }]}>
                              <Ionicons name="checkmark" size={12} color="#fff" />
                            </View>
                          ) : null}
                          <Text style={styles.sportEmoji}>{s.emoji}</Text>
                          <Text style={styles.sportLabel} numberOfLines={2}>
                            {s.label}
                          </Text>
                        </LinearGradient>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              {step === 2 && (
                <>
                  {selectedSports.length === 0 ? (
                    <Body muted>Go back and select at least one sport.</Body>
                  ) : (
                    selectedSports.map((sid) => {
                      const sp = sportProfiles[sid];
                      if (!sp) return null;
                      const a = getSportAccent(sid);
                      return (
                        <View key={sid} style={[styles.sportDetailCard, { borderLeftColor: a }]}>
                          <Text style={styles.sportDetailTitle}>{SPORTS.find((x) => x.id === sid)?.label}</Text>
                          <Text style={styles.miniHeading}>Positions</Text>
                          <View style={styles.chips}>
                            {POSITIONS_BY_SPORT[sid].map((p) => {
                              const active = sp.positions?.includes(p);
                              return (
                                <Pressable
                                  key={p}
                                  onPress={() => {
                                    const cur = sp.positions ?? [];
                                    const next = active ? cur.filter((x) => x !== p) : [...cur, p];
                                    updateSport(sid, {
                                      positions: next.length ? next : [POSITIONS_BY_SPORT[sid][0]!],
                                    });
                                  }}
                                >
                                  <View style={[styles.chip, active && { borderColor: a, backgroundColor: a + '22' }]}>
                                    <Text style={[styles.chipText, active && { color: '#fff' }]}>{p}</Text>
                                  </View>
                                </Pressable>
                              );
                            })}
                          </View>
                          <Text style={[styles.miniHeading, { marginTop: 14 }]}>Skill level</Text>
                          <View style={styles.chips}>
                            {SKILL.map((sk) => {
                              const active = sp.skillLevel === sk;
                              return (
                                <Pressable key={sk} onPress={() => updateSport(sid, { skillLevel: sk })}>
                                  <View style={[styles.chip, active && { borderColor: a, backgroundColor: a + '33' }]}>
                                    <Text style={[styles.chipTextCap, active && { color: '#fff' }]}>{sk}</Text>
                                  </View>
                                </Pressable>
                              );
                            })}
                          </View>
                        </View>
                      );
                    })
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <Text style={styles.miniHeading}>I am a…</Text>
                  {ROLES.map((r) => {
                    const on = role === r.id;
                    return (
                      <Pressable key={r.id} onPress={() => setRole(r.id)} style={styles.roleRowWrap}>
                        <View style={[styles.roleRow, on && { borderColor: brand.blue, backgroundColor: brand.blue + '18' }]}>
                          <View style={[styles.radioOuter, on && { borderColor: brand.blue }]}>
                            {on ? <View style={styles.radioInner} /> : null}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.roleTitle}>{r.label}</Text>
                            <Text style={styles.roleDesc}>{r.desc}</Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}

                  <Text style={[styles.miniHeading, { marginTop: 22 }]}>Age group</Text>
                  <View style={styles.ageGrid}>
                    {AGE.map((a) => {
                      const on = ageGroup === a.id;
                      return (
                        <Pressable key={a.id} onPress={() => setAgeGroup(a.id)} style={styles.ageCell}>
                          <View style={[styles.agePill, on && { borderColor: brand.red, backgroundColor: brand.red + '22' }]}>
                            <Text style={[styles.agePillText, on && { color: '#fff' }]}>{a.label}</Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )}

              {step === 4 && (
                <>
                  <Pressable
                    onPress={locate}
                    disabled={locating}
                    style={({ pressed }) => [
                      styles.locationCard,
                      pressed && !locating && { opacity: 0.92 },
                      locating && { opacity: 0.75 },
                    ]}
                  >
                    <LinearGradient colors={[brand.blue + '33', brand.card]} style={styles.locationCardInner}>
                      <View style={styles.locationIconWrap}>
                        {locating ? (
                          <ActivityIndicator color={brand.blue} />
                        ) : (
                          <Ionicons name="navigate" size={24} color={brand.blue} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.locationCardTitle}>
                          {locating ? 'Getting your location…' : 'Use my current location'}
                        </Text>
                        <Text style={styles.locationCardSub}>Sets your city for nearby games & weather</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={brand.textMuted} />
                    </LinearGradient>
                  </Pressable>

                  <Text style={[styles.fieldLabel, { marginTop: 18 }]}>City & region</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. San Jose, CA"
                    placeholderTextColor="rgba(244,246,255,0.35)"
                    value={city}
                    onChangeText={setCity}
                  />

                  <Text style={[styles.miniHeading, { marginTop: 20 }]}>What are you here for?</Text>
                  <Text style={styles.fieldHint}>Select all that apply — you can update these later.</Text>
                  <View style={{ marginTop: 10, gap: 10 }}>
                    {GOALS.map((g) => {
                      const on = goals.includes(g.id);
                      return (
                        <Pressable
                          key={g.id}
                          onPress={() =>
                            setGoals((prev) => (on ? prev.filter((x) => x !== g.id) : [...prev, g.id]))
                          }
                        >
                          <View style={[styles.goalRow, on && { borderColor: brand.success, backgroundColor: brand.success + '14' }]}>
                            <View style={[styles.goalCheck, on && { backgroundColor: brand.success, borderColor: brand.success }]}>
                              {on ? <Ionicons name="checkmark" size={14} color="#0B1020" /> : null}
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.goalTitle}>{g.label}</Text>
                              <Text style={styles.goalHint}>{g.hint}</Text>
                            </View>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          {step > 0 ? (
            <Pressable onPress={() => setStep((s) => s - 1)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color={brand.textMuted} />
              <Text style={styles.backBtnText}>Back</Text>
            </Pressable>
          ) : (
            <View style={styles.backSpacer} />
          )}
          <View style={styles.footerRight}>
            {step < 4 ? (
              <PrimaryButton
                title="Continue"
                onPress={() => setStep((s) => s + 1)}
                accent={accent}
                style={styles.nextBtn}
              />
            ) : saving ? (
              <View style={styles.savingWrap}>
                <ActivityIndicator color={brand.text} />
              </View>
            ) : (
              <PrimaryButton title="Enter PlayBook" onPress={finish} style={styles.nextBtn} />
            )}
          </View>
        </View>
      </SafeAreaView>

      <WebcamCaptureModal
        visible={webcamOpen}
        onClose={() => setWebcamOpen(false)}
        onCapture={(uri) => {
          setPhotoUri(uri);
          setWebcamOpen(false);
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeTop: { flex: 1 },
  kav: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerBlock: {
    marginBottom: 20,
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 18,
  },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  progressSegOn: {
    backgroundColor: brand.blue,
  },
  stepLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  stepBadgeText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.2,
    color: brand.textMuted,
  },
  stepTitle: {
    fontSize: 30,
    lineHeight: 36,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: brand.textMuted,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
  },
  fieldLabel: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 13,
    color: brand.text,
    marginBottom: 8,
  },
  fieldLabelSpaced: {
    marginTop: 22,
  },
  fieldHint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: brand.textMuted,
    marginBottom: 14,
    lineHeight: 19,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: brand.text,
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
  },
  photoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 3,
  },
  avatarRingGrad: {
    flex: 1,
    borderRadius: 57,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 54,
  },
  avatarPlaceholder: {
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  avatarPhText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
    color: 'rgba(244,246,255,0.5)',
  },
  photoActions: {
    flex: 1,
    minWidth: 160,
    gap: 10,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  outlineBtnText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    color: brand.text,
  },
  sportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  sportTile: {
    flexBasis: '31%',
    flexGrow: 1,
    maxWidth: '48%',
    minWidth: 96,
  },
  sportTileInner: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: brand.cardBorder,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  checkDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  sportLabel: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 11,
    color: brand.text,
    textAlign: 'center',
    lineHeight: 14,
  },
  sportDetailCard: {
    borderLeftWidth: 4,
    paddingLeft: 14,
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  sportDetailTitle: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 18,
    color: brand.text,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  miniHeading: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.8,
    color: brand.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  chipText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: brand.textMuted,
  },
  chipTextCap: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 11,
    color: brand.textMuted,
    textTransform: 'capitalize',
  },
  roleRowWrap: {
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: brand.blue,
  },
  roleTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
    color: brand.text,
  },
  roleDesc: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: brand.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ageCell: {},
  agePill: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  agePillText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
    color: brand.textMuted,
  },
  locationCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  locationCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(45,85,212,0.35)',
  },
  locationIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(45,85,212,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationCardTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
    color: brand.text,
  },
  locationCardSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: brand.textMuted,
    marginTop: 2,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  goalCheck: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: brand.text,
  },
  goalHint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: brand.textMuted,
    marginTop: 2,
  },
  footerSafe: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    gap: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingRight: 12,
  },
  backBtnText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: brand.textMuted,
  },
  backSpacer: { minWidth: 80 },
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
    maxWidth: 220,
  },
  nextBtn: {
    minWidth: 200,
    alignSelf: 'flex-end',
  },
  savingWrap: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
});
