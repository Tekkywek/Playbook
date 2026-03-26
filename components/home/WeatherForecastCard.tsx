import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { DayForecast, HourForecast, WeatherIconKey } from '@/services/weather';

function iconName(icon: WeatherIconKey): keyof typeof Ionicons.glyphMap {
  switch (icon) {
    case 'sun':
      return 'sunny-outline';
    case 'partly':
      return 'partly-sunny-outline';
    case 'cloud':
      return 'cloud-outline';
    case 'fog':
      return 'cloudy-outline';
    case 'rain':
      return 'rainy-outline';
    case 'snow':
      return 'snow-outline';
    case 'storm':
      return 'thunderstorm-outline';
  }
}

export function WeatherForecastCard({
  cityLabel,
  hourly,
  daily,
}: {
  cityLabel: string;
  hourly: HourForecast[];
  daily: DayForecast[];
}) {
  const range = useMemo(() => {
    const mins = daily.map((d) => d.minF);
    const maxs = daily.map((d) => d.maxF);
    const min = Math.min(...mins);
    const max = Math.max(...maxs);
    return { min, max: Math.max(min + 1, max) };
  }, [daily]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerKicker}>HOURLY FORECAST</Text>
        <Text style={styles.headerCity}>{cityLabel}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourRow}>
        {hourly.map((h) => (
          <View key={h.label} style={styles.hourCell}>
            <Text style={styles.hourLabel}>{h.label}</Text>
            <Ionicons name={iconName(h.icon)} size={18} color="rgba(255,255,255,0.92)" />
            <Text style={styles.hourTemp}>{Math.round(h.tempF)}°</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.divider} />

      <Text style={styles.subHeader}>10‑DAY FORECAST</Text>

      <View style={styles.dayList}>
        {daily.slice(0, 10).map((d) => {
          const left = (d.minF - range.min) / (range.max - range.min);
          const width = (d.maxF - d.minF) / (range.max - range.min);
          return (
            <View key={d.label} style={styles.dayRow}>
              <Text style={styles.dayLabel}>{d.label}</Text>
              <View style={styles.dayIconCol}>
                <Ionicons name={iconName(d.icon)} size={18} color="rgba(255,255,255,0.92)" />
                {typeof d.precipPct === 'number' ? <Text style={styles.precip}>{d.precipPct}%</Text> : null}
              </View>
              <Text style={styles.tempMin}>{d.minF}°</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { left: `${left * 100}%`, width: `${Math.max(6, width * 100)}%` }]} />
              </View>
              <Text style={styles.tempMax}>{d.maxF}°</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    padding: 14,
    backgroundColor: '#51639A',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerKicker: { fontSize: 11, letterSpacing: 0.6, color: 'rgba(255,255,255,0.75)', fontFamily: 'DMSans_600SemiBold' },
  headerCity: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontFamily: 'DMSans_400Regular' },

  hourRow: { paddingTop: 10, paddingBottom: 8, gap: 14 },
  hourCell: { alignItems: 'center', width: 54 },
  hourLabel: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontFamily: 'DMSans_600SemiBold' },
  hourTemp: { marginTop: 2, fontSize: 14, color: 'rgba(255,255,255,0.95)', fontFamily: 'DMSans_600SemiBold' },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.14)', marginTop: 6, marginBottom: 10 },
  subHeader: { fontSize: 11, letterSpacing: 0.6, color: 'rgba(255,255,255,0.65)', fontFamily: 'DMSans_600SemiBold' },

  dayList: { marginTop: 10, gap: 10 },
  dayRow: { flexDirection: 'row', alignItems: 'center' },
  dayLabel: { width: 54, fontSize: 14, color: 'rgba(255,255,255,0.95)', fontFamily: 'DMSans_600SemiBold' },
  dayIconCol: { width: 44, alignItems: 'center' },
  precip: { marginTop: 2, fontSize: 11, color: 'rgba(203, 213, 255, 0.9)', fontFamily: 'DMSans_600SemiBold' },
  tempMin: { width: 44, textAlign: 'right', fontSize: 14, color: 'rgba(255,255,255,0.75)', fontFamily: 'DMSans_600SemiBold' },
  tempMax: { width: 44, textAlign: 'left', fontSize: 14, color: 'rgba(255,255,255,0.95)', fontFamily: 'DMSans_600SemiBold' },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginHorizontal: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: '#FF7A1A',
  },
});

