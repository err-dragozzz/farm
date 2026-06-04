"use client";

import type React from "react";
import { useState } from "react";

import { motion } from "framer-motion";

import { toast } from "sonner";

import {
  Sprout,
  Wheat,
  Leaf,
  Tractor,
  Plus,
  TrendingUp
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { EmptyState } from "@/components/ui/empty-state";

import { Badge } from "@/components/ui/badge";

import { useApi } from "@/hooks/use-api";

import type {
  Crop,
  Farm
} from "@/types/farmledger";

export function CropsClient() {
  const { data: crops, refresh } =
    useApi<Crop[]>("/api/crops");

  const { data: farms } =
    useApi<Farm[]>("/api/farms");

  const [form, setForm] = useState({
    farmId: "",
    name: "",
    variety: "",
    quantity: "",
    expectedYield: "",
    actualYield: "",
    season: ""
  });

  async function submit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const response = await fetch(
      "/api/crops",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          ...form,
          quantity: Number(
            form.quantity || 0
          ),
          expectedYield: Number(
            form.expectedYield || 0
          ),
          actualYield: Number(
            form.actualYield || 0
          )
        })
      }
    );

    if (!response.ok) {
      return toast.error(
        "Could not add crop"
      );
    }

    toast.success("Crop saved");

    setForm({
      farmId: "",
      name: "",
      variety: "",
      quantity: "",
      expectedYield: "",
      actualYield: "",
      season: ""
    });

    refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
      {/* LEFT FORM */}
      <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-green-500/10 blur-3xl" />

        <CardHeader className="relative z-10">
          <Badge className="w-fit border-0 bg-green-500/15 text-green-300">
            Crop Intelligence
          </Badge>

          <CardTitle className="mt-3 text-2xl font-bold">
            Add crop
          </CardTitle>

          <CardDescription className="text-white/50">
            Record crop lifecycle,
            planting quantity, and
            yield analytics.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <form
            className="space-y-5"
            onSubmit={submit}
          >
            {/* FARM */}
            <div className="space-y-2">
              <Label className="text-white/80">
                Farm
              </Label>

              <Select
                value={form.farmId}
                onValueChange={(farmId) =>
                  setForm((current) => ({
                    ...current,
                    farmId
                  }))
                }
              >
                <SelectTrigger
                  className="
                    h-12 rounded-2xl
                    border-white/10
                    bg-white/[0.03]
                    text-white
                  "
                >
                  <SelectValue placeholder="Select farm" />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-[#111827] text-white">
                  {farms?.map((farm) => (
                    <SelectItem
                      key={farm.id}
                      value={farm.id}
                    >
                      {farm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* INPUTS */}
            {[
              ["name", "Crop name"],
              ["variety", "Variety"],
              [
                "quantity",
                "Quantity planted"
              ],
              [
                "expectedYield",
                "Expected yield kg"
              ],
              [
                "actualYield",
                "Actual yield kg"
              ],
              ["season", "Season"]
            ].map(([key, label]) => (
              <div
                key={key}
                className="space-y-2"
              >
                <Label className="text-white/80">
                  {label}
                </Label>

                <Input
                  type={
                    key.includes(
                      "Yield"
                    ) ||
                    key === "quantity"
                      ? "number"
                      : "text"
                  }
                  value={
                    form[
                      key as keyof typeof form
                    ]
                  }
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]:
                        event.target.value
                    }))
                  }
                  required={[
                    "name",
                    "season"
                  ].includes(key)}
                  className="
                    h-12 rounded-2xl
                    border-white/10
                    bg-white/[0.03]
                    text-white
                    placeholder:text-white/30
                    focus:border-green-500/40
                    focus:ring-green-500/20
                  "
                />
              </div>
            ))}

            {/* BUTTON */}
            <Button
              className="
  
h-11
rounded-xl
border
border-green-500/20
bg-gradient-to-b
from-green-500
to-green-600
px-6
text-white
font-medium
shadow-[0_4px_20px_rgba(34,197,94,0.18)]
transition-all
duration-200
hover:brightness-110
hover:shadow-[0_6px_24px_rgba(34,197,94,0.28)]
active:scale-[0.98]

              "
            >
              <Plus className="mr-2 h-4 w-4" />
              Save crop
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* RIGHT SECTION */}
      <section className="space-y-5">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Crop portfolio
            </h2>

            <p className="mt-1 text-white/50">
              Yield history, seasonal
              analytics, and farm crop
              tracking.
            </p>
          </div>

          <Badge className="bg-white/5 text-white">
            {crops?.length ?? 0} Crops
          </Badge>
        </div>

        {/* EMPTY */}
        {!crops?.length && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-14">
            <EmptyState
              icon={Sprout}
              title="No crops recorded"
              description="Add crops to build yield history and improve AI farming predictions."
            />
          </div>
        )}

        {/* CARDS */}
        <div className="grid gap-5 md:grid-cols-2">
          {crops?.map((crop, index) => (
            <motion.div
              key={crop.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.05
              }}
            >
              <Card
                className="
                  group overflow-hidden
                  rounded-3xl
                  border border-white/10
                  bg-white/[0.03]
                  backdrop-blur-2xl
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-green-500/30
                "
              >
                {/* TOP */}
                <div className="relative overflow-hidden border-b border-white/5 p-5">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />

                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {crop.name}
                      </h3>

                      <p className="mt-2 text-sm text-white/50">
                        {crop.farm?.name} ·{" "}
                        {crop.season}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-green-500/10 p-3">
                      <Sprout className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <CardContent className="space-y-4 p-5">
                  <div className="grid grid-cols-3 gap-3">
                    {/* VARIETY */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-2 text-white/40">
                        <Leaf className="h-4 w-4" />

                        <span className="text-xs">
                          Variety
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-bold">
                        {crop.variety ??
                          "Standard"}
                      </p>
                    </div>

                    {/* TARGET */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-2 text-white/40">
                        <Wheat className="h-4 w-4" />

                        <span className="text-xs">
                          Target
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-bold">
                        {crop.expectedYield ??
                          0}{" "}
                        kg
                      </p>
                    </div>

                    {/* ACTUAL */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-2 text-white/40">
                        <TrendingUp className="h-4 w-4" />

                        <span className="text-xs">
                          Actual
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-bold text-green-400">
                        {crop.actualYield ??
                          0}{" "}
                        kg
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM */}
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-green-500/10 p-2">
                        <Tractor className="h-4 w-4 text-green-400" />
                      </div>

                      <div>
                        <p className="text-xs text-white/40">
                          Farm
                        </p>

                        <p className="font-semibold">
                          {crop.farm?.name}
                        </p>
                      </div>
                    </div>

                    <Badge className="border-0 bg-green-500/15 text-green-300">
                      {crop.season}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

