/** OpenWeatherMap current weather — free tier API key in EXPO_PUBLIC_OPENWEATHER_API_KEY */

export async function fetchWeatherNudge(lat: number, lng: number, cityLabel: string): Promise<string> {
  const key = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!key) {
    return `Set your OpenWeather API key for live weather in ${cityLabel}.`;
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${key}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('weather');
    const j = (await res.json()) as {
      main: { temp: number };
      weather: { description: string }[];
  };
    const temp = Math.round(j.main.temp);
    const desc = j.weather[0]?.description ?? 'clear';
    return `${temp}°F and ${desc} in ${cityLabel} — great conditions to play.`;
  } catch {
    return `Weather unavailable — check conditions before you head out in ${cityLabel}.`;
  }
}
