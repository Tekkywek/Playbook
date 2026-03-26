import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardShell, dashPurple, dashMuted, dashInk } from '@/components/dashboard/DashboardShell';

export default function ComingSoonScreen() {
  return (
    <DashboardShell active="coming_soon">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="rocket-outline" size={48} color={dashPurple} />
          </View>
          <Text style={styles.title}>Coming soon</Text>
          <Text style={styles.body}>
            We&apos;re building new experiences here — advanced scouting, club billing, and live game overlays. Stay
            tuned.
          </Text>
        </View>
      </ScrollView>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8E4FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 26,
    color: dashInk,
    marginBottom: 12,
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: dashMuted,
    textAlign: 'center',
  },
});
