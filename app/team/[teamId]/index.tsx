import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { brand } from '@/constants/theme';
import { subscribeTeam, addTeamEvent, joinTeamByCode } from '@/services/teams';
import type { TeamDoc } from '@/types';
import { Timestamp } from 'firebase/firestore';

export default function TeamDetailScreen() {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const router = useRouter();
  const { user, profile } = useAuth();
  const { accent } = useTheme();
  const [team, setTeam] = useState<TeamDoc | null>(null);
  const [tab, setTab] = useState<'roster' | 'channels' | 'schedule' | 'stats'>('roster');
  const [invite, setInvite] = useState('');
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');

  useEffect(() => {
    if (!teamId) return;
    const u = subscribeTeam(teamId, setTeam);
    return () => u();
  }, [teamId]);

  const joinWithCode = async () => {
    if (!invite.trim() || !teamId) return;
    try {
      const t = team;
      if (t && t.inviteCode === invite.trim().toUpperCase()) {
        if (user) await joinTeamByCode(teamId, user.uid);
        Alert.alert('Joined', 'Welcome to the team.');
      } else {
        Alert.alert('Code', 'Invite code does not match this team.');
      }
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  const addEvent = async () => {
    if (!teamId || !evTitle.trim()) return;
    const d = evDate ? new Date(evDate) : new Date(Date.now() + 86400000);
    await addTeamEvent(teamId, { title: evTitle, startsAt: d, type: 'practice', location: '' });
    setEvTitle('');
    Alert.alert('Scheduled', 'Team calendar updated.');
  };

  if (!team) {
    return (
      <Screen>
        <Body muted>Loading team…</Body>
      </Screen>
    );
  }

  const isCoach = user?.uid === team.coachUid;
  const isMember = user && team.memberIds?.includes(user.uid);
  const premium = profile?.premiumTier === 'coach_pro' || profile?.premiumTier === 'club_elite';
  const channelCap = premium ? 999 : profile?.coachChannelLimit ?? 3;

  const joinPublic = async () => {
    if (!user || !teamId) return;
    try {
      await joinTeamByCode(teamId, user.uid);
      Alert.alert('Welcome', "You're on the roster.");
    } catch (e) {
      Alert.alert('Join', String(e));
    }
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <Title>{team.name}</Title>
      <Body muted>
        {team.sportId} · {team.memberIds?.length ?? 0} members · {team.wins}-{team.losses}
      </Body>

      {!isMember && team.visibility === 'public' ? (
        <PrimaryButton title="Join team" onPress={joinPublic} />
      ) : null}

      <View style={styles.tabs}>
        {(['roster', 'channels', 'schedule', 'stats'] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && { borderColor: accent }]}>
            <Label style={{ fontSize: 10 }}>{t}</Label>
          </Pressable>
        ))}
      </View>

      {tab === 'roster' && (
        <View style={{ marginTop: 12, gap: 8 }}>
          {team.members?.map((m) => (
            <View key={m.uid} style={styles.row}>
              <Body style={{ fontFamily: 'DMSans_600SemiBold' }}>{m.uid.slice(0, 8)}…</Body>
              <Body muted>
                {m.role} {m.position ? `· ${m.position}` : ''}
              </Body>
            </View>
          ))}
        </View>
      )}

      {tab === 'channels' && (
        <View style={{ marginTop: 12, gap: 10 }}>
          <Body muted>
            Real-time chat in Firestore. Channels: {team.channels?.length ?? 0}/{channelCap} (Coach Pro unlocks
            unlimited.)
          </Body>
          {team.channels?.map((c) => (
            <PrimaryButton
              key={c.id}
              title={`# ${c.name}`}
              onPress={() => router.push(`/team/${teamId}/channel/${c.id}`)}
              accent={accent}
            />
          ))}
          {isCoach && !premium && (team.channels?.length ?? 0) >= channelCap ? (
            <Body muted>Unlock unlimited channels with Coach Pro.</Body>
          ) : null}
        </View>
      )}

      {tab === 'schedule' && (
        <View style={{ marginTop: 12, gap: 10 }}>
          {(team.events ?? []).map((e) => (
            <View key={e.id} style={styles.card}>
              <Body style={{ fontFamily: 'DMSans_600SemiBold' }}>{e.title}</Body>
              <Body muted>{(e.startsAt as Timestamp).toDate().toLocaleString()}</Body>
            </View>
          ))}
          {isCoach ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Event title"
                placeholderTextColor={brand.textMuted}
                value={evTitle}
                onChangeText={setEvTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="ISO date"
                placeholderTextColor={brand.textMuted}
                value={evDate}
                onChangeText={setEvDate}
              />
              <PrimaryButton title="Add practice / game" onPress={addEvent} />
            </>
          ) : null}
        </View>
      )}

      {tab === 'stats' && (
        <View style={{ marginTop: 12 }}>
          <Body>Team record {team.wins}-{team.losses}. Leaderboards sync from game results.</Body>
        </View>
      )}

      <View style={{ height: 20 }} />
      <Label>Have an invite code?</Label>
      <TextInput
        style={styles.input}
        autoCapitalize="characters"
        placeholder="CODE"
        placeholderTextColor={brand.textMuted}
        value={invite}
        onChangeText={setInvite}
      />
      <PrimaryButton title="Join team" onPress={joinWithCode} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  tab: {
    borderWidth: 1,
    borderColor: brand.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  row: {
    backgroundColor: brand.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  card: {
    backgroundColor: brand.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
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
