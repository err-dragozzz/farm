import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessFarm, requireUser } from "@/lib/api";

export async function GET(request: NextRequest) {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const farmId = request.nextUrl.searchParams.get("farmId");
  if (!farmId) return NextResponse.json({ error: "farmId is required" }, { status: 400 });
  if (!(await canAccessFarm(farmId, gate.user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const farm = await prisma.farm.findUnique({ where: { id: farmId } });
  if (!farm) return NextResponse.json({ error: "Farm not found" }, { status: 404 });

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || !farm.latitude || !farm.longitude) {
    return NextResponse.json({
      condition: "Partly cloudy",
      temperature: 27,
      humidity: 62,
      rainfall: 3.4,
      forecast: [
        { day: "Today", condition: "Cloudy", rain: 3.4 },
        { day: "Tomorrow", condition: "Sunny", rain: 0.8 }
      ]
    });
  }

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${farm.latitude}&lon=${farm.longitude}&units=metric&appid=${key}`, { next: { revalidate: 900 } });
  const weather = await response.json();
  const payload = {
    condition: weather.weather?.[0]?.description ?? "Unknown",
    temperature: weather.main?.temp ?? 0,
    humidity: weather.main?.humidity ?? 0,
    rainfall: weather.rain?.["1h"] ?? 0
  };

  await prisma.weatherData.create({ data: { farmId, ...payload } });
  return NextResponse.json(payload);
}
