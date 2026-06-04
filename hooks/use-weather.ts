// hooks/use-weather.ts

"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  temperature: number;
  city: string;
  condition: string;
  humidity: number;
  wind: number;
};

export function useWeather() {
  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat =
            position.coords.latitude;

          const lon =
            position.coords.longitude;

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=95825ae6bcc0ad59233c75528feca4ac`
          );

          const data =
            await response.json();

          setWeather({
            temperature: Math.round(
              data.main.temp
            ),

            city: data.name,

            condition:
              data.weather?.[0]
                ?.description ?? "",

            humidity:
              data.main.humidity,

            wind: data.wind.speed
          });
        } catch (error) {
          console.error(
            "Weather fetch failed",
            error
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      }
    );
  }, []);

  return {
    weather,
    loading
  };
}

