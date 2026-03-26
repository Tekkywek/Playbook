import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  title?: string;
};

export function GameMap({
  initialCenter,
  pins,
  accent,
  height = 220,
  fill = false,
  // Web uses these for interactive filtering; native can ignore for now.
  radiusMiles: _radiusMiles,
  onCenterChanged: _onCenterChanged,
}: {
  initialCenter: { lat: number; lng: number };
  pins: MapPin[];
  accent: string;
  height?: number;
  fill?: boolean;
  radiusMiles?: number;
  onCenterChanged?: (c: { lat: number; lng: number }) => void;
}) {
  const region = {
    latitude: initialCenter.lat,
    longitude: initialCenter.lng,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  };

  return (
    <View style={[styles.wrap, fill ? styles.fill : { height }]}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={region}>
        {pins.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            pinColor={accent}
            title={p.title}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 16, overflow: 'hidden' },
  fill: { flex: 1 },
});

