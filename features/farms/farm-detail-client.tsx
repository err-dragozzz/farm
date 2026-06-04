"use client";

import { useParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { currency } from "@/lib/utils";
import type { Farm } from "@/types/farmledger";

export function FarmDetailClient() {
  const params = useParams<{ id: string }>();
  const { data, loading } = useApi<Farm>(`/api/farms/${params.id}`);

  if (loading || !data) return <Skeleton className="h-[560px]" />;

  const chart = [
    { name: "Invested", value: Number(data.totalInvested) },
    { name: "Estimated", value: Number(data.estimatedProfit) }
  ];

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden glass-panel">
        {data.image && <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${data.image})` }} />}
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-2xl">{data.name}</CardTitle>
              <CardDescription>{data.location} · {data.area} acres · {data.soilType}</CardDescription>
            </div>
            <Badge variant="success">{data.status}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Investment profile</CardTitle>
            <CardDescription>Planned crop economics for this farm.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => currency(Number(value))} />
                <Bar dataKey="value" fill="#287653" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Crop history</CardTitle>
            <CardDescription>Varieties and yield targets recorded against the farm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.crops?.map((crop) => (
              <div key={crop.id} className="rounded-md border bg-background/70 p-3">
                <p className="font-medium">{crop.name} {crop.variety ? `· ${crop.variety}` : ""}</p>
                <p className="text-sm text-muted-foreground">Season {crop.season} · Expected {crop.expectedYield ?? 0} kg · Actual {crop.actualYield ?? 0} kg</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
