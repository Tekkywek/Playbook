import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { brand } from '@/constants/theme';
import { SPORTS } from '@/constants/sports';
import { subscribeGame, joinGame } from '@/services/games';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import type { GameDoc } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, profile } = useAuth();
  const { accent } = useTheme();
  const [game, setGame] = useState<GameDoc | null>(null);
  const [skill, setSkill] = useState(5);
  const [rel, setRel] = useState(5);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!id) return;
    const u = subscribeGame(id, setGame);
    return () => u();
  }, [id]);

  const onJoin = async () => {
    if (!user || !id) return;
    try {
      await joinGame(id, user.uid);
    } catch (e) {
      Alert.alert('Join', String(e));
    }
  };

  const teammateUid =
    user && game ? game.players?.find((p) => p.uid !== user.uid && p.status === 'joined')?.uid : undefined;

  const submitRating = async () => {
    if (!user || !teammateUid || !id) {
      Alert.alert('Rating', 'No teammate to rate yet.');
      return;
    }
    const db = getDb();
    if (!db) return;
    await addDoc(collection(db, 'users', teammateUid, 'reviews'), {
      fromUid: user.uid,
      gameId: id,
      skillStars: skill,
      reliabilityStars: rel,
      comment: note.trim() || null,
      createdAt: serverTimestamp(),
    });
    Alert.alert('Thanks', 'Your rating was submitted.');
  };

  if (!game) {
    return (
      <Screen>
        <Body muted>Loading…</Body>
      </Screen>
    );
  }

  const emoji = SPORTS.find((s) => s.id === game.sportId)?.emoji ?? '🏟️';
  const filled = game.players?.filter((p) => p.status === 'joined').length ?? 0;
  const hostRel = profile?.reliabilityScore ?? 80;

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <LinearGradient colors={[accent + '33', brand.card]} style={styles.hero}>
          <Body>
            {emoji} {game.sportId} · {game.gameType}
          </Body>
          <Title style={{ marginTop: 8 }}>{game.title}</Title>
          <Body muted style={{ marginTop: 8 }}>
            {game.locationLabel}
          </Body>
          <Body style={{ marginTop: 8 }}>{game.startsAt.toDate().toLocaleString()}</Body>
          <Body style={{ marginTop: 8 }}>
            {filled}/{game.playerLimit} players · Host reliability ~{hostRel}
          </Body>
        </LinearGradient>

        <Body style={{ marginTop: 16 }}>{game.description || 'No description yet.'}</Body>

        <PrimaryButton title="Join game" onPress={onJoin} />

        {game.ended && teammateUid ? (
          <View style={styles.rateBox}>
            <Label>Post-game rating</Label>
            <Body muted>Rate a teammate: skill and reliability (1–5).</Body>
            <Body>Skill stars: {skill} (adjust with profile settings in a future update)</Body>
            <Body>Reliability stars: {rel}</Body>
            <TextInput
              style={styles.input}
              placeholder="Optional comment"
              placeholderTextColor={brand.textMuted}
              value={note}
              onChangeText={setNote}
            />
            <PrimaryButton title="Submit rating" onPress={submitRating} />
          </View>
        ) : null}

        {!game.ended ? (
          <Body muted style={{ marginTop: 16 }}>
            After the game, you&apos;ll both be nudged to rate skill & reliability.
          </Body>
        ) : null}

        <View style={{ height: 16 }} />
        <PrimaryButton title="Back" onPress={() => router.back()} accent={brand.card} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 16, padding: 16, borderWidth: 1, borderColor: brand.cardBorder },
  rateBox: { marginTop: 24, gap: 8 },
  input: {
    backgroundColor: brand.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: brand.cardBorder,
    padding: 12,
    color: brand.text,
    fontFamily: 'DMSans_400Regular',
  },
});
