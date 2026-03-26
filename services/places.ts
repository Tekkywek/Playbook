import type { SportId } from '@/types';

export type PracticeSpot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  kind: 'sports_centre' | 'pitch' | 'stadium' | 'track' | 'swimming_pool' | 'fitness_centre' | 'other';
};

type OverpassElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

const cache = new Map<string, { at: number; items: PracticeSpot[] }>();
const CACHE_MS = 10 * 60 * 1000;

const SPORT_TO_TAG: Record<SportId, string[]> = {
  soccer: ['soccer', 'football'],
  basketball: ['basketball'],
  football: ['american_football', 'football'],
  baseball: ['baseball'],
  tennis: ['tennis'],
  volleyball: ['volleyball', 'beachvolleyball'],
  lacrosse: ['lacrosse'],
  hockey: ['field_hockey', 'ice_hockey', 'hockey'],
  swimming: ['swimming'],
  track: ['athletics', 'running'],
  wrestling: ['wrestling'],
  golf: ['golf'],
  softball: ['softball'],
  rugby: ['rugby'],
  pickleball: ['pickleball'],
};

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`${label} timed out`)), ms)),
  ]);
}

function buildOverpassQuery(lat: number, lng: number, radiusM: number, sport: SportId | 'all'): string {
  const sportParts =
    sport === 'all'
      ? ''
      : SPORT_TO_TAG[sport]
          .map(
            (s) =>
              `node["sport"="${s}"](around:${radiusM},${lat},${lng});way["sport"="${s}"](around:${radiusM},${lat},${lng});relation["sport"="${s}"](around:${radiusM},${lat},${lng});`
          )
          .join('');

  // Include common facility types for training/open gym discovery.
  return [
    '[out:json][timeout:25];',
    '(',
    `node["leisure"="sports_centre"](around:${radiusM},${lat},${lng});`,
    `way["leisure"="sports_centre"](around:${radiusM},${lat},${lng});`,
    `relation["leisure"="sports_centre"](around:${radiusM},${lat},${lng});`,
    `node["leisure"="pitch"](around:${radiusM},${lat},${lng});`,
    `way["leisure"="pitch"](around:${radiusM},${lat},${lng});`,
    `relation["leisure"="pitch"](around:${radiusM},${lat},${lng});`,
    `node["leisure"="stadium"](around:${radiusM},${lat},${lng});`,
    `way["leisure"="stadium"](around:${radiusM},${lat},${lng});`,
    `relation["leisure"="stadium"](around:${radiusM},${lat},${lng});`,
    `node["leisure"="track"](around:${radiusM},${lat},${lng});`,
    `way["leisure"="track"](around:${radiusM},${lat},${lng});`,
    `node["leisure"="fitness_centre"](around:${radiusM},${lat},${lng});`,
    `way["leisure"="fitness_centre"](around:${radiusM},${lat},${lng});`,
    `node["leisure"="swimming_pool"](around:${radiusM},${lat},${lng});`,
    `way["leisure"="swimming_pool"](around:${radiusM},${lat},${lng});`,
    sportParts,
    ');',
    'out body center;',
  ].join('');
}

function kindFromTags(tags: Record<string, string> | undefined): PracticeSpot['kind'] {
  if (!tags) return 'other';
  const leisure = tags.leisure;
  if (leisure === 'sports_centre') return 'sports_centre';
  if (leisure === 'pitch') return 'pitch';
  if (leisure === 'stadium') return 'stadium';
  if (leisure === 'track') return 'track';
  if (leisure === 'swimming_pool') return 'swimming_pool';
  if (leisure === 'fitness_centre') return 'fitness_centre';
  return 'other';
}

export async function fetchPracticeSpots(
  lat: number,
  lng: number,
  radiusMiles: number,
  sport: SportId | 'all'
): Promise<PracticeSpot[]> {
  const radiusM = Math.max(500, Math.min(30000, Math.round(radiusMiles * 1609.34)));
  const key = `${lat.toFixed(3)}:${lng.toFixed(3)}:${radiusM}:${sport}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now - hit.at < CACHE_MS) return hit.items;

  const query = buildOverpassQuery(lat, lng, radiusM, sport);
  const res = await withTimeout(
    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: query,
    }),
    12000,
    'Overpass'
  );
  if (!res.ok) throw new Error('overpass');

  const json = (await res.json()) as { elements?: OverpassElement[] };
  const elements = json.elements ?? [];

  const byId = new Map<string, PracticeSpot>();
  for (const e of elements) {
    const latV = e.lat ?? e.center?.lat;
    const lngV = e.lon ?? e.center?.lon;
    if (typeof latV !== 'number' || typeof lngV !== 'number') continue;

    const tags = e.tags ?? {};
    const name =
      tags.name ||
      tags['name:en'] ||
      (tags.leisure ? tags.leisure.replace('_', ' ') : null) ||
      'Practice spot';

    const id = `${e.type}-${e.id}`;
    byId.set(id, {
      id,
      name,
      lat: latV,
      lng: lngV,
      kind: kindFromTags(tags),
    });
  }

  const items = Array.from(byId.values()).slice(0, 160);
  cache.set(key, { at: now, items });
  return items;
}

