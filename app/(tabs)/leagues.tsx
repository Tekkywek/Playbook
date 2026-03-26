import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, TextInput, Alert, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { brand } from '@/constants/theme';
import { subscribeLeagues, createLeague } from '@/services/leagues';
import type { LeagueDoc, LeagueFormat } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';

const FORMATS: LeagueFormat[] = ['round_robin', 'single_elim', 'double_elim', 'ladder'];

const SIDEBAR_W = 1024;

export default function LeaguesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const bottomPad = width >= SIDEBAR_W ? 28 : 100;
  const { user, profile } = useAuth();
  const { accent } = useTheme();
  const [rows, setRows] = useState<LeagueDoc[]>([]);
  const [name, setName] = useState('');
  const [format, setFormat] = useState<LeagueFormat>('round_robin');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile?.primarySportId) return;
    const u = subscribeLeagues(profile.primarySportId, setRows);
    return () => u();
  }, [profile?.primarySportId]);

  const canCreate = profile?.role === 'coach' || profile?.role === 'both';

  const onCreate = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      const id = await createLeague({
        commissionerUid: user.uid,
        name: name.trim(),
        sportId: profile?.primarySportId ?? 'soccer',
        format,
        seasonStart: new Date(),
        seasonEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        teamLimit: 16,
        feeCents: 0,
        rules: 'Fair play. Respect officials.',
        locationLabel: profile?.location?.city ?? 'TBD',
      });
      router.push(`/league/${id}`);
    } catch (e) {
      Alert.alert('League', String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell active="league">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
      <Title style={styles.pageTitle}>Leagues</Title>
      <Body muted style={styles.pageMuted}>
        Organized seasons — standings, schedules, and league-wide leaderboards.
      </Body>

      {rows.map((L) => (
        <Pressable key={L.id} onPress={() => router.push(`/league/${L.id}`)}>
          <LinearGradient colors={[accent + '22', brand.card]} style={styles.card}>
            <Body style={{ fontFamily: 'DMSans_600SemiBold' }}>{L.name}</Body>
            <Body muted>
              {L.format} · {(L.registeredTeamIds ?? []).length} teams · Fee ${(L.feeCents / 100).toFixed(0)}
            </Body>
          </LinearGradient>
        </Pressable>
      ))}
      {rows.length === 0 ? (
        <Body muted style={[styles.pageMuted, { marginTop: 12 }]}>
          No leagues in your sport yet — create one as a coach or club admin.
        </Body>
      ) : null}

      {canCreate ? (
        <>
          <Label style={[styles.sectionLabel, { marginTop: 24 }]}>Create league</Label>
          <TextInput
            style={styles.input}
            placeholder="League name"
            placeholderTextColor={brand.textMuted}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.row}>
            {FORMATS.map((f) => (
              <Pressable key={f} onPress={() => setFormat(f)}>
                <View style={[styles.chip, format === f && { borderColor: accent }]}>
                  <Body style={{ fontSize: 10 }}>{f}</Body>
                </View>
              </Pressable>
            ))}
          </View>
          <PrimaryButton title={saving ? 'Creating…' : 'Create league'} onPress={onCreate} loading={saving} />
        </>
      ) : (
        <Body muted style={{ marginTop: 20 }}>
          League creation is limited to coaches — upgrade your profile role in settings (coming soon) or ask a coach
          to commission a league.
        </Body>
      )}
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
    marginTop: 12,
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    borderWidth: 1,
    borderColor: brand.cardBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: brand.inkSoft,
  },
});
