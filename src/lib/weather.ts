// Live weather via Open-Meteo (free, keyless, CORS-enabled).
// https://open-meteo.com/

export interface WeatherSnapshot {
  tempF: number;
  feelsLikeF: number;
  windMph: number;
  windDirDeg: number;
  pressureHpa: number;
  pressureTrend: "rising" | "falling" | "steady";
  conditionCode: number;
  conditionLabel: string;
  isDay: boolean;
  fetchedAt: string;
  locationLabel: string;
}

const WMO_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ hail",
  99: "Severe thunderstorm",
};

export function conditionLabelFor(code: number): string {
  return WMO_LABELS[code] ?? "Unsettled";
}

export async function fetchWeather(
  lat: number,
  lon: number,
  locationLabel: string,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "wind_speed_10m",
      "wind_direction_10m",
      "surface_pressure",
      "weather_code",
      "is_day",
    ].join(","),
    hourly: "surface_pressure",
    past_hours: "3",
    forecast_hours: "1",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
  const json = await res.json();

  const current = json.current ?? {};
  const hourlyPressures: number[] = json.hourly?.surface_pressure ?? [];
  const trend = pressureTrend(hourlyPressures);

  return {
    tempF: Math.round(current.temperature_2m ?? 0),
    feelsLikeF: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 0),
    windMph: Math.round(current.wind_speed_10m ?? 0),
    windDirDeg: current.wind_direction_10m ?? 0,
    pressureHpa: Math.round(current.surface_pressure ?? 1013),
    pressureTrend: trend,
    conditionCode: current.weather_code ?? 0,
    conditionLabel: conditionLabelFor(current.weather_code ?? 0),
    isDay: current.is_day === 1,
    fetchedAt: new Date().toISOString(),
    locationLabel,
  };
}

function pressureTrend(series: number[]): WeatherSnapshot["pressureTrend"] {
  if (series.length < 2) return "steady";
  const first = series[0];
  const last = series[series.length - 1];
  const delta = last - first;
  if (delta > 0.6) return "rising";
  if (delta < -0.6) return "falling";
  return "steady";
}

export interface GeoResult {
  name: string;
  admin1?: string;
  country?: string;
  lat: number;
  lon: number;
}

export async function searchLocation(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return [];
  const params = new URLSearchParams({ name: query, count: "5", language: "en", format: "json" });
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.results ?? []).map((r: Record<string, unknown>) => ({
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    lat: r.latitude,
    lon: r.longitude,
  }));
}

export function windCompass(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}
