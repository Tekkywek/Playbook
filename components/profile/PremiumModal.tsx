import React, { useState } from 'react';
import { View, Modal, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { Title, Body, Label } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { brand } from '@/constants/theme';

const PLANS = [
  {
    id: 'athlete_pro',
    name: 'Athlete Pro',
    monthly: 8,
    annual: 79,
    features: [
      'Boosted scout visibility',
      'AI highlight reel generation',
      'Advanced stats & badge multipliers',
      'Priority game matching',
      'Remove ads',
    ],
  },
  {
    id: 'coach_pro',
    name: 'Coach Pro',
    monthly: 99,
    annual: 999,
    features: [
      'AI coaching assistant channel',
      'Unlimited team channels',
      'Per-player performance reports',
      'Roster analytics & film tools',
      'Advanced scheduling + RSVP',
    ],
  },
  {
    id: 'club_elite',
    name: 'Club Elite',
    monthly: 599,
    annual: 5999,
    features: [
      'All Coach Pro features',
      'Unlimited age-group teams',
      'Club-wide analytics',
      'Integrated scheduling',
      'Custom branding & priority support',
    ],
  },
];

export function PremiumModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [annual, setAnnual] = useState(true);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.head}>
            <Title style={{ fontSize: 24 }}>Go Premium</Title>
            <Pressable onPress={onClose}>
              <Body style={{ color: brand.textMuted }}>Close</Body>
            </Pressable>
          </View>
          <View style={styles.toggleRow}>
            <Body>Monthly</Body>
            <Switch value={annual} onValueChange={setAnnual} />
            <Body>Annual (save)</Body>
          </View>
          <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ gap: 12 }}>
            {PLANS.map((p) => (
              <View key={p.id} style={styles.plan}>
                <Title style={{ fontSize: 20 }}>{p.name}</Title>
                <Body style={{ fontFamily: 'DMSans_600SemiBold', marginTop: 4 }}>
                  ${annual ? p.annual : p.monthly}/{annual ? 'yr' : 'mo'}
                </Body>
                {p.features.map((f) => (
                  <Body muted key={f} style={{ marginTop: 4 }}>
                    ✓ {f}
                  </Body>
                ))}
                <PrimaryButton title="Choose plan" onPress={onClose} />
              </View>
            ))}
          </ScrollView>
          <Body muted style={{ marginTop: 8 }}>
            Billing integrates with App Store / Play Billing in production — this is the full UI experience.
          </Body>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: brand.inkSoft,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    maxHeight: '92%',
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  plan: {
    borderWidth: 1,
    borderColor: brand.cardBorder,
    borderRadius: 16,
    padding: 14,
    backgroundColor: brand.card,
    gap: 4,
  },
});
