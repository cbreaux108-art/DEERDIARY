import { useEffect, useState } from "react";
import { fetchWeather, type WeatherSnapshot } from "./weather";
import { getMoonInfo, type MoonInfo } from "./moon";

const FALLBACK_LOCATION = { lat: 38.5, lon: -92.2, label: "Central hunting grounds" };

export interface ConditionsState {
  moon: MoonInfo;
  weather: WeatherSnapshot | null;
  weatherStatus: "idle" | "loading" | "ready" | "error";
  usingFallbackLocation: boolean;
}

export function useConditions(): ConditionsState {
  const [moon] = useState<MoonInfo>(() => getMoonInfo());
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [weatherStatus, setWeatherStatus] = useState<ConditionsState["weatherStatus"]>("idle");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setWeatherStatus("loading");

    const load = async (lat: number, lon: number, label: string) => {
      try {
        const snap = await fetchWeather(lat, lon, label);
        if (!cancelled) {
          setWeather(snap);
          setWeatherStatus("ready");
        }
      } catch {
        if (!cancelled) setWeatherStatus("error");
      }
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude, "Your location"),
        () => {
          setUsingFallback(true);
          load(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon, FALLBACK_LOCATION.label);
        },
        { timeout: 6000 },
      );
    } else {
      setUsingFallback(true);
      load(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lon, FALLBACK_LOCATION.label);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return { moon, weather, weatherStatus, usingFallbackLocation: usingFallback };
}
