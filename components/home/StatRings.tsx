import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Body, Label } from '@/components/ui/Typography';
import { brand } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function Ring({
  label,
  value,
  max,
  color,
  size = 76,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  size?: number;
}) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, value / max));
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(pct, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [pct, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }), [circumference]);

  return (
    <View style={styles.ringCol}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>
      <Body style={styles.ringPct}>{Math.round(pct * 100)}%</Body>
      <Label style={styles.ringLabel}>{label}</Label>
    </View>
  );
}

export function StatRingsRow({
  gamesPlayed,
  winRate,
  reliability,
  skill,
  accent,
}: {
  gamesPlayed: number;
  winRate: number;
  reliability: number;
  skill: number;
  accent: string;
}) {
  const winPct = winRate <= 1 ? winRate * 100 : winRate;
  const skillPct = skill <= 5 ? skill * 20 : skill;
  return (
    <View style={styles.row}>
      <Ring label="Played" value={Math.min(gamesPlayed, 100)} max={100} color={accent} />
      <Ring label="Win %" value={winPct} max={100} color={brand.success} />
      <Ring
        label="Reliable"
        value={reliability}
        max={100}
        color={reliability >= 80 ? brand.success : reliability >= 60 ? brand.warn : brand.danger}
      />
      <Ring label="Skill" value={skillPct} max={100} color={brand.blue} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  ringCol: { alignItems: 'center', width: '22%', minWidth: 72 },
  ringPct: { marginTop: 6, fontFamily: 'DMSans_600SemiBold', fontSize: 13 },
  ringLabel: { marginTop: 4, textAlign: 'center', fontSize: 10 },
});
