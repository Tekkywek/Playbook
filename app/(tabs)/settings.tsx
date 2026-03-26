import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardShell, dashPurple, dashMuted, dashInk } from '@/components/dashboard/DashboardShell';
import { useRouter } from 'expo-router';

const rows: { icon: keyof typeof Ionicons.glyphMap; label: string; hint: string }[] = [
  { icon: 'notifications-outline', label: 'Notifications', hint: 'Game reminders & team chatter' },
  { icon: 'lock-closed-outline', label: 'Privacy', hint: 'Profile visibility & data' },
  { icon: 'color-palette-outline', label: 'Appearance', hint: 'Theme follows your device' },
  { icon: 'help-circle-outline', label: 'Help & support', hint: 'FAQ and contact' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [push, setPush] = React.useState(true);

  return (
    <DashboardShell active="settings">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.pageSub}>Manage your PlayBook experience.</Text>

        <View style={styles.card}>
          {rows.map((r) => (
            <Pressable key={r.label} style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
              <View style={styles.iconCircle}>
                <Ionicons name={r.icon} size={22} color={dashPurple} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{r.label}</Text>
                <Text style={styles.rowHint}>{r.hint}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={dashMuted} />
            </Pressable>
          ))}
          <View style={[styles.row, styles.rowLast]}>
            <View style={styles.iconCircle}>
              <Ionicons name="phone-portrait-outline" size={22} color={dashPurple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Push notifications</Text>
              <Text style={styles.rowHint}>Match invites & league updates</Text>
            </View>
            <Switch value={push} onValueChange={setPush} trackColor={{ false: '#e2e8f0', true: dashPurple + '88' }} />
          </View>
        </View>

        <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.linkRow}>
          <Text style={styles.linkText}>Edit full profile</Text>
          <Ionicons name="arrow-forward" size={18} color={dashPurple} />
        </Pressable>
      </ScrollView>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  pageTitle: {
    fontFamily: 'Oswald_700Bold',
    fontSize: 28,
    color: dashInk,
    marginBottom: 6,
  },
  pageSub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: dashMuted,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8E4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
    color: dashInk,
  },
  rowHint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: dashMuted,
    marginTop: 2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  linkText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
    color: dashPurple,
  },
});
