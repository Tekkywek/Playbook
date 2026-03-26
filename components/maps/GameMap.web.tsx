import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import maplibregl, { type Map as MapLibreMap, type LngLatLike } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  title?: string;
};

function styleUrl(): string {
  // If you later want Mapbox/MapTiler styles, set EXPO_PUBLIC_MAP_STYLE_URL in `.env`.
  // Example (MapTiler): https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY
  // Default: CARTO Voyager basemap (includes city labels).
  return process.env.EXPO_PUBLIC_MAP_STYLE_URL ?? 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
}

export function GameMap({
  initialCenter,
  pins,
  accent,
  height = 220,
  fill = false,
  radiusMiles,
  onCenterChanged,
}: {
  initialCenter: { lat: number; lng: number };
  pins: MapPin[];
  accent: string;
  height?: number;
  fill?: boolean;
  radiusMiles?: number;
  onCenterChanged?: (c: { lat: number; lng: number }) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: pins.map((p) => ({
        type: 'Feature' as const,
        properties: { id: p.id, title: p.title ?? '' },
        geometry: { type: 'Point' as const, coordinates: [p.lng, p.lat] as [number, number] },
      })),
    }),
    [pins]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const center: LngLatLike = [initialCenter.lng, initialCenter.lat];

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl(),
      center,
      zoom: 11,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    const onMoveEnd = () => {
      const c = map.getCenter();
      onCenterChanged?.({ lat: c.lat, lng: c.lng });
    };
    map.on('moveend', onMoveEnd);

    map.on('load', () => {
      if (!map.getSource('games')) {
        map.addSource('games', { type: 'geojson', data: geojson });
      }
      if (!map.getLayer('games-circle')) {
        map.addLayer({
          id: 'games-circle',
          type: 'circle',
          source: 'games',
          paint: {
            'circle-radius': 7,
            'circle-color': accent,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'rgba(255,255,255,0.9)',
          },
        });
      }
      if (!map.getLayer('games-label')) {
        map.addLayer({
          id: 'games-label',
          type: 'symbol',
          source: 'games',
          layout: {
            'text-field': ['get', 'title'],
            'text-size': 12,
            'text-offset': [0, 1.2],
            'text-anchor': 'top',
          },
          paint: { 'text-color': 'rgba(255,255,255,0.9)', 'text-halo-color': 'rgba(0,0,0,0.45)', 'text-halo-width': 1.2 },
        });
      }
    });

    // Resize when the container changes (e.g. modal open / window resize).
    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      try {
        map.resize();
      } catch {
        /* ignore */
      }
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      map.off('moveend', onMoveEnd);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update data + accent.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource('games') as maplibregl.GeoJSONSource | undefined;
    src?.setData(geojson as any);
    if (map.getLayer('games-circle')) {
      map.setPaintProperty('games-circle', 'circle-color', accent);
    }
  }, [geojson, accent]);

  // (Optional) show a rough radius circle by scaling pixels with zoom.
  // For a perfect geodesic circle we'd add a polygon; keeping this lightweight for now.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (typeof radiusMiles !== 'number') return;
    const id = 'radius-halo';

    const ensure = () => {
      const c = map.getCenter();
      const feature = {
        type: 'Feature' as const,
        properties: {},
        geometry: { type: 'Point' as const, coordinates: [c.lng, c.lat] as [number, number] },
      };

      if (!map.getSource(id)) map.addSource(id, { type: 'geojson', data: feature });
      else (map.getSource(id) as maplibregl.GeoJSONSource).setData(feature as any);

      if (!map.getLayer(id)) {
        map.addLayer({
          id,
          type: 'circle',
          source: id,
          paint: {
            'circle-color': 'rgba(124,58,237,0.08)',
            'circle-stroke-color': 'rgba(255,255,255,0.20)',
            'circle-stroke-width': 1,
          },
        });
      }

      // Approx: convert miles → meters, meters → pixels at current lat/zoom.
      const meters = radiusMiles * 1609.34;
      const lat = c.lat * (Math.PI / 180);
      const metersPerPixel = (156543.03392 * Math.cos(lat)) / Math.pow(2, map.getZoom());
      const px = Math.max(18, Math.min(260, meters / metersPerPixel));
      map.setPaintProperty(id, 'circle-radius', px);
    };

    if (map.loaded()) ensure();
    const rerender = () => ensure();
    map.on('move', rerender);
    map.on('zoom', rerender);

    return () => {
      // The map may have been removed by the parent effect cleanup already.
      try {
        map.off('move', rerender);
        map.off('zoom', rerender);
      } catch {
        /* ignore */
      }
      try {
        if (map.getLayer(id)) map.removeLayer(id);
      } catch {
        /* ignore */
      }
      try {
        if (map.getSource(id)) map.removeSource(id);
      } catch {
        /* ignore */
      }
    };
  }, [radiusMiles]);

  return (
    <View style={[styles.wrap, fill ? styles.fill : { height }]}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#151D33' },
  fill: { flex: 1 },
});

