import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, TextInput, Alert, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { brand } from '@/constants/theme';
import { subscribeMyTeams, subscribePublicTeams, createTeam } from '@/services/teams';
import type { TeamDoc } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';

const SIDEBAR_W = 1024;

export default function TeamsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const bottomPad = width >= SIDEBAR_W ? 28 : 100;
  const { user, profile } = useAuth();
  const { accent } = useTheme();
  const [mine, setMine] = useState<TeamDoc[]>([]);
  const [discover, setDiscover] = useState<TeamDoc[]>([]);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const u = subscribeMyTeams(user.uid, setMine);
    return () => u();
  }, [user?.uid]);

  useEffect(() => {
    if (!profile?.primarySportId) return;
    const u = subscribePublicTeams(profile.primarySportId, setDiscover);
    return () => u();
  }, [profile?.primarySportId]);

  const onCreate = async () => {
    if (!user || !name.trim()) {
      Alert.alert('Team', 'Enter a team name.');
      return;
    }
    setCreating(true);
    try {
      const id = await createTeam({
        coachUid: user.uid,
        name: name.trim(),
        sportId: profile?.primarySportId ?? 'soccer',
        ageGroup: profile?.ageGroup ?? 'adult_rec',
        logoUrl: null,
        visibility: 'public',
      });
      router.push(`/team/${id}`);
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardShell active="coaching">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
      <Title style={styles.pageTitle}>Teams</Title>
      <Body muted style={styles.pageMuted}>
        Persistent squads — roster, Slack-style channels, schedule, and stats.
      </Body>

      <Label style={[styles.sectionLabel, { marginTop: 20 }]}>Your teams</Label>
      {mine.map((t) => (
        <Pressable key={t.id} onPress={() => router.push(`/team/${t.id}`)}>
          <LinearGradient colors={[brand.card, brand.inkSoft]} style={styles.card}>
            <Body style={{ fontFamily: 'DMSans_600SemiBold' }}>{t.name}</Body>
            <Body muted>
              {t.sportId} · {t.memberIds?.length ?? 0} athletes · Next event soon
            </Body>
          </LinearGradient>
        </Pressable>
      ))}
      {mine.length === 0 ? (
        <Body muted style={[styles.pageMuted, { marginTop: 8 }]}>
          You&apos;re not on a team yet — create one or browse below.
        </Body>
      ) : null}

      <Label style={[styles.sectionLabel, { marginTop: 20 }]}>Discover public teams</Label>
      {discover.map((t) => (
        <Pressable key={t.id} onPress={() => router.push(`/team/${t.id}`)}>
          <LinearGradient colors={[accent + '22', brand.card]} style={styles.card}>
            <Body style={{ fontFamily: 'DMSans_600SemiBold' }}>{t.name}</Body>
            <Body muted>Invite {t.inviteCode}</Body>
          </LinearGradient>
        </Pressable>
      ))}

      <Label style={[styles.sectionLabel, { marginTop: 24 }]}>Create a team</Label>
      <TextInput
        style={styles.input}
        placeholder="Team name"
        placeholderTextColor={brand.textMuted}
        value={name}
        onChangeText={setName}
      />
      <PrimaryButton title={creating ? 'Creating…' : 'Create team'} onPress={onCreate} loading={creating} />
      </ScrollView>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  pageTitle: { color: '#161b28' },
  pageMuted: { color: 'rgba(22,27,40,0.62)' },
  sectionLabel: { color: 'rgba(22,27,40,0.45)' },
  card: {
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  input: {
    marginTop: 8,
    backgroundColor: brand.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: brand.cardBorder,
    padding: 12,
    color: brand.text,
    fontFamily: 'DMSans_400Regular',
  },
});
