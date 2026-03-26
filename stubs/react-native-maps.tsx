import React from 'react';
import { View, Text, StyleSheet, type ViewProps } from 'react-native';

/** Web / Next.js stub — native maps are not bundled for browser. */
export default function MapView({ style, children, ..._rest }: ViewProps & { initialRegion?: unknown }) {
  return (
    <View style={[styles.placeholder, style]}>
      <Text style={styles.hint}>Map preview isn&apos;t available in the browser build.</Text>
      {children}
    </View>
  );
}

export function Marker(_props: unknown) {
  return null;
}

const styles = StyleSheet.create({
  placeholder: {
    minHeight: 200,
    backgroundColor: '#151D33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { color: 'rgba(244,246,255,0.5)', fontSize: 13, textAlign: 'center', padding: 16 },
});
