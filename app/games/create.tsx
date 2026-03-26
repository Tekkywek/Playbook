import React, { useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, Pressable, Switch, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { brand, getSportAccent } from '@/constants/theme';
import { SPORTS } from '@/constants/sports';
import type { GameDoc, SkillLevel, SportId } from '@/types';
import { createGame } from '@/services/games';
import { LinearGradient } from 'expo-linear-gradient';

const GAME_TYPES: GameDoc['gameType'][] = ['pickup', 'scrimmage', 'tournament', 'skills', 'practice_open'];
const SKILLS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'elite'];

export default function CreateGameScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { accent } = useTheme();
  const [step, setStep] = useState(0);
  const [sportId, setSportId] = useState<SportId>(profile?.primarySportId ?? 'soccer');
  const [gameType, setGameType] = useState<GameDoc['gameType']>('pickup');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [lat, setLat] = useState(profile?.location?.lat ?? 37.55);
  const [lng, setLng] = useState(profile?.location?.lng ?? -122.0);
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('18:00');
  const [duration, setDuration] = useState('90');
  const [playerLimit, setPlayerLimit] = useState('10');
  const [minSkill, setMinSkill] = useState<SkillLevel>('intermediate');
  const [fee, setFee] = useState('0');
  const [visibility, setVisibility] = useState<GameDoc['visibility']>('public');
  const [indoor, setIndoor] = useState(false);
  const [saving, setSaving] = useState(false);

  const locate = async () => {
    const p = await Location.requestForegroundPermissionsAsync();
    if (!p.granted) {
      Alert.alert('Location', 'Needed to pin the game.');
      return;
    }
    const pos = await Location.getCurrentPositionAsync({});
    const rev = await Location.reverseGeocodeAsync({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });
    setLat(pos.coords.latitude);
    setLng(pos.coords.longitude);
    const r = rev[0];
    if (r) setLocationLabel([r.name, r.city].filter(Boolean).join(', '));
  };

  const submit = async () => {
    if (!user) return;
    if (!title.trim() || !locationLabel.trim()) {
      Alert.alert('Missing', 'Title and location required.');
      return;
    }
    const d = dateStr ? new Date(`${dateStr}T${timeStr}:00`) : new Date(Date.now() + 3600000);
    setSaving(true);
    try {
      const id = await createGame({
        hostId: user.uid,
        sportId,
        gameType,
        title: title.trim(),
        description: description.trim(),
        locationLabel: locationLabel.trim(),
        lat,
        lng,
        startsAt: d,
        durationMinutes: Number(duration) || 60,
        playerLimit: Number(playerLimit) || 10,
        minSkill,
        entryFeeCents: Math.round(Number(fee) * 100) || 0,
        visibility,
        coverImageUrl: null,
        indoor,
      });
      router.replace(`/games/${id}`);
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setSaving(false);
    }
  };

  const c = getSportAccent(sportId);

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Label>Step {step + 1} / 3</Label>
        <Title style={{ marginTop: 8 }}>Create a game</Title>

        {step === 0 && (
          <>
            <Body muted>Pick your sport and format.</Body>
            <View style={styles.grid}>
              {SPORTS.map((s) => (
                <Pressable key={s.id} onPress={() => setSportId(s.id)}>
                  <LinearGradient
                    colors={sportId === s.id ? [c + '55', brand.card] : [brand.card, brand.card]}
                    style={[styles.cell, sportId === s.id && { borderColor: c }]}
                  >
                    <Body>{s.emoji}</Body>
                    <Body style={{ fontSize: 11 }}>{s.label}</Body>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
            <Label style={{ marginTop: 16 }}>Game type</Label>
            <View style={styles.row}>
              {GAME_TYPES.map((gt) => (
                <Pressable key={gt} onPress={() => setGameType(gt)}>
                  <View style={[styles.chip, gameType === gt && { borderColor: accent }]}>
                    <Body style={{ fontSize: 11 }}>{gt}</Body>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Body muted>Where and when — be specific so players trust the run.</Body>
            <TextInput style={styles.input} placeholder="Title" placeholderTextColor={brand.textMuted} value={title} onChangeText={setTitle} />
            <TextInput
              style={[styles.input, { minHeight: 72 }]}
              placeholder="Description, rules, what to bring"
              placeholderTextColor={brand.textMuted}
              multiline
              value={description}
              onChangeText={setDescription}
            />
            <PrimaryButton title="Use current location" onPress={locate} />
            <TextInput
              style={styles.input}
              placeholder="Location label"
              placeholderTextColor={brand.textMuted}
              value={locationLabel}
              onChangeText={setLocationLabel}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Date YYYY-MM-DD"
                placeholderTextColor={brand.textMuted}
                value={dateStr}
                onChangeText={setDateStr}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="HH:MM"
                placeholderTextColor={brand.textMuted}
                value={timeStr}
                onChangeText={setTimeStr}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Duration min"
                placeholderTextColor={brand.textMuted}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Player limit"
                placeholderTextColor={brand.textMuted}
                value={playerLimit}
                onChangeText={setPlayerLimit}
                keyboardType="numeric"
              />
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Label>Min skill</Label>
            <View style={styles.row}>
              {SKILLS.map((sk) => (
                <Pressable key={sk} onPress={() => setMinSkill(sk)}>
                  <View style={[styles.chip, minSkill === sk && { borderColor: c }]}>
                    <Body style={{ fontSize: 11 }}>{sk}</Body>
                  </View>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Entry fee USD (0 free)"
              placeholderTextColor={brand.textMuted}
              value={fee}
              onChangeText={setFee}
              keyboardType="decimal-pad"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <Body>Indoor</Body>
              <Switch value={indoor} onValueChange={setIndoor} />
            </View>
            <Label style={{ marginTop: 12 }}>Visibility</Label>
            <View style={styles.row}>
              {(['public', 'invite_only', 'teams_only'] as const).map((v) => (
                <Pressable key={v} onPress={() => setVisibility(v)}>
                  <View style={[styles.chip, visibility === v && { borderColor: accent }]}>
                    <Body style={{ fontSize: 10 }}>{v}</Body>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <View style={styles.nav}>
          {step > 0 ? <PrimaryButton title="Back" onPress={() => setStep((s) => s - 1)} accent={brand.card} /> : <View style={{ flex: 1 }} />}
          {step < 2 ? (
            <PrimaryButton title="Next" onPress={() => setStep((s) => s + 1)} accent={c} />
          ) : (
            <PrimaryButton title={saving ? 'Saving…' : 'Publish game'} onPress={submit} loading={saving} />
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  cell: {
    width: 104,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  input: {
    marginTop: 10,
    backgroundColor: brand.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: brand.cardBorder,
    padding: 12,
    color: brand.text,
    fontFamily: 'DMSans_400Regular',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    borderWidth: 1,
    borderColor: brand.cardBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: brand.inkSoft,
  },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
});
