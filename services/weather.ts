/**
 * Weather nudge:
 * - Real weather from Open-Meteo (no API key)
 * - Optional text polishing via Gemini or ChatGPT if an API key is present
 */

const WEATHER_CODE_TO_TEXT: Record<number, string> = {
  0: 'clear sky',
  1: 'mainly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'freezing fog',
  51: 'light drizzle',
  53: 'moderate drizzle',
  55: 'dense drizzle',
  56: 'light freezing drizzle',
  57: 'dense freezing drizzle',
  61: 'slight rain',
  63: 'moderate rain',
  65: 'heavy rain',
  66: 'light freezing rain',
  67: 'heavy freezing rain',
  71: 'slight snow fall',
  73: 'moderate snow fall',
  75: 'heavy snow fall',
  77: 'snow grains',
  80: 'slight rain showers',
  81: 'moderate rain showers',
  82: 'violent rain showers',
  85: 'slight snow showers',
  86: 'heavy snow showers',
  95: 'thunderstorm',
  96: 'thunderstorm with slight hail',
  99: 'thunderstorm with heavy hail',
};

export type WeatherIconKey = 'sun' | 'partly' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm';

export type HourForecast = {
  /** e.g. "Now", "7AM" */
  label: string;
  tempF: number;
  weatherCode: number;
  icon: WeatherIconKey;
};

export type DayForecast = {
  /** e.g. "Today", "Fri" */
  label: string;
  minF: number;
  maxF: number;
  weatherCode: number;
  icon: WeatherIconKey;
  precipPct?: number;
};

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error(`${label} timed out`)), ms)
    ),
  ]);
}

function iconForWeatherCode(code: number): WeatherIconKey {
  if (code === 0) return 'sun';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'cloud';
}

type OpenMeteoCurrent = {
  temperatureF: number;
  weatherCode: number;
  windMph?: number;
  humidityPct?: number;
};

async function fetchOpenMeteoCurrent(lat: number, lng: number): Promise<OpenMeteoCurrent> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lng)}` +
    `&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m` +
    `&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('open-meteo');

  const j = (await res.json()) as {
    current?: {
      temperature_2m?: number;
      weather_code?: number;
      wind_speed_10m?: number;
      relative_humidity_2m?: number;
    };
  };

  const cur = j.current;
  if (!cur?.temperature_2m || typeof cur.weather_code !== 'number') {
    throw new Error('open-meteo-missing-fields');
  }

  return {
    temperatureF: cur.temperature_2m,
    weatherCode: cur.weather_code,
    windMph: typeof cur.wind_speed_10m === 'number' ? cur.wind_speed_10m : undefined,
    humidityPct: typeof cur.relative_humidity_2m === 'number' ? cur.relative_humidity_2m : undefined,
  };
}

async function polishWithGemini(prompt: string): Promise<string | null> {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!key) return null;

  // Gemini REST: https://ai.google.dev/gemini-api/docs
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 80,
      topP: 0.9,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  const j = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return j.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

async function polishWithOpenAI(prompt: string): Promise<string | null> {
  const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!key) return null;

  const url = 'https://api.openai.com/v1/chat/completions';
  const body = {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 90,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  const j = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return j.choices?.[0]?.message?.content ?? null;
}

function fallbackNudge(cityLabel: string, cur: OpenMeteoCurrent): string {
  const temp = Math.round(cur.temperatureF);
  const condition = WEATHER_CODE_TO_TEXT[cur.weatherCode] ?? 'weather';
  const wind = typeof cur.windMph === 'number' ? `, wind ${Math.round(cur.windMph)} mph` : '';
  return `${temp}°F and ${condition} in ${cityLabel}${wind} — good time to get moving.`;
}

function formatHourLabel(d: Date): string {
  const h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}${ampm}`;
}

/**
 * Open-Meteo forecast (no API key).
 * Returns a compact set for the Home card: next ~6 hours + next ~7-10 days.
 */
export async function fetchWeatherForecast(
  lat: number,
  lng: number
): Promise<{ hourly: HourForecast[]; daily: DayForecast[] }> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lng)}` +
    `&current=temperature_2m,weather_code` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=temperature_2m_min,temperature_2m_max,weather_code,precipitation_probability_max` +
    `&temperature_unit=fahrenheit&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('open-meteo-forecast');

  const j = (await res.json()) as {
    current?: { time?: string; temperature_2m?: number; weather_code?: number };
    hourly?: { time?: string[]; temperature_2m?: number[]; weather_code?: number[] };
    daily?: {
      time?: string[];
      temperature_2m_min?: number[];
      temperature_2m_max?: number[];
      weather_code?: number[];
      precipitation_probability_max?: number[];
    };
  };

  const h = j.hourly;
  const d = j.daily;
  if (!h?.time || !h.temperature_2m || !h.weather_code) throw new Error('open-meteo-hourly-missing');
  if (!d?.time || !d.temperature_2m_min || !d.temperature_2m_max || !d.weather_code) throw new Error('open-meteo-daily-missing');

  // Hourly: choose the current hour index by closest timestamp.
  const now = Date.now();
  const hourTimes = h.time.map((t) => new Date(t).getTime());
  let startIdx = 0;
  for (let i = 0; i < hourTimes.length; i++) {
    if (hourTimes[i]! >= now) {
      startIdx = i;
      break;
    }
  }

  const hourly: HourForecast[] = [];
  for (let i = startIdx; i < Math.min(startIdx + 6, h.time.length); i++) {
    const dt = new Date(h.time[i]!);
    const temp = Math.round(h.temperature_2m[i] ?? NaN);
    const code = h.weather_code[i] ?? 3;
    if (!Number.isFinite(temp)) continue;
    hourly.push({
      label: hourly.length === 0 ? 'Now' : formatHourLabel(dt),
      tempF: temp,
      weatherCode: code,
      icon: iconForWeatherCode(code),
    });
  }

  // Daily: take up to 10; label first "Today".
  const daily: DayForecast[] = [];
  const maxDays = Math.min(10, d.time.length);
  for (let i = 0; i < maxDays; i++) {
    const dt = new Date(d.time[i]!);
    const minF = Math.round(d.temperature_2m_min[i] ?? NaN);
    const maxF = Math.round(d.temperature_2m_max[i] ?? NaN);
    if (!Number.isFinite(minF) || !Number.isFinite(maxF)) continue;
    const code = d.weather_code[i] ?? 3;
    const precip = d.precipitation_probability_max?.[i];
    daily.push({
      label: i === 0 ? 'Today' : dt.toLocaleDateString(undefined, { weekday: 'short' }),
      minF,
      maxF,
      weatherCode: code,
      icon: iconForWeatherCode(code),
      precipPct: typeof precip === 'number' ? Math.round(precip) : undefined,
    });
  }

  return { hourly, daily };
}

export async function fetchWeatherNudge(
  lat: number,
  lng: number,
  cityLabel: string
): Promise<string> {
  try {
    const cur = await fetchOpenMeteoCurrent(lat, lng);

    // Optional: Use Gemini/OpenAI to turn raw conditions into a friendly nudge.
    const prompt = [
      'You are a sports app coach writing a single short weather “nudge” message.',
      'Return exactly ONE sentence, 90 characters or less, no emojis, no quotes, no Markdown.',
      `Location: ${cityLabel}`,
      `Weather: ${cur.temperatureF}F, ${WEATHER_CODE_TO_TEXT[cur.weatherCode] ?? 'weather'}, ` +
        `${typeof cur.windMph === 'number' ? `wind ${Math.round(cur.windMph)} mph` : 'wind n/a'}.`,
      'Mention whether conditions sound good for pickup (lightly optimistic or cautious).',
    ].join('\n');

    const polished =
      (await withTimeout(polishWithGemini(prompt), 3000, 'Gemini')) ??
      (await withTimeout(polishWithOpenAI(prompt), 3000, 'OpenAI')) ??
      null;

    if (polished && polished.trim().length > 0) return polished.trim();
    return fallbackNudge(cityLabel, cur);
  } catch {
    return `Weather unavailable — check conditions before you head out in ${cityLabel}.`;
  }
}
