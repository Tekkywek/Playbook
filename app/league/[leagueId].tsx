import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { brand } from '@/constants/theme';
import { subscribeLeague } from '@/services/leagues';
import type { LeagueDoc } from '@/types';

export default function LeagueDetailScreen() {
  const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
  const router = useRouter();
  const { accent } = useTheme();
  const [L, setL] = useState<LeagueDoc | null>(null);
  const [tab, setTab] = useState<'standings' | 'schedule' | 'stats' | 'teams'>('standings');

  useEffect(() => {
    if (!leagueId) return;
    const u = subscribeLeague(leagueId, setL);
    return () => u();
  }, [leagueId]);

  if (!L) {
    return (
      <Screen>
        <Body muted>Loading league…</Body>
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <Title>{L.name}</Title>
      <Body muted>
        {L.format} · {L.locationLabel} · {(L.registeredTeamIds ?? []).length} teams registered
      </Body>

      <View style={styles.tabs}>
        {(['standings', 'schedule', 'stats', 'teams'] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && { borderColor: accent }]}>
            <Label style={{ fontSize: 10 }}>{t}</Label>
          </Pressable>
        ))}
      </View>

      {tab === 'standings' && (
        <View style={{ marginTop: 12, gap: 8 }}>
          {(L.standings ?? []).map((row, i) => (
            <View key={row.teamId} style={styles.row}>
              <Body>
                #{i + 1} {row.teamName}
              </Body>
              <Body muted>
                {row.wins}-{row.losses} · {row.points} pts · diff {row.diff}
              </Body>
            </View>
          ))}
          {(L.standings ?? []).length === 0 ? <Body muted>Standings populate as scores post.</Body> : null}
        </View>
      )}

      {tab === 'schedule' && (
        <Body muted style={{ marginTop: 12 }}>
          Full schedule / bracket updates live when commissioners enter results.
        </Body>
      )}

      {tab === 'stats' && (
        <Body muted style={{ marginTop: 12 }}>
          League-wide stat leaders — goals, assists, reliability — surface here.
        </Body>
      )}

      {tab === 'teams' && (
        <Body muted style={{ marginTop: 12 }}>
          Registered teams and rosters mirror the Teams tab.
        </Body>
      )}

      <View style={{ height: 16 }} />
      <PrimaryButton title="Back" onPress={() => router.back()} accent={brand.card} />
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
});
