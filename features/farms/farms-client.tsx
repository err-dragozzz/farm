"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import {
  Archive,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Sprout,
  Tractor,
  DollarSign
} from "lucide-react";

import { motion } from "framer-motion";

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
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

import { useApi } from "@/hooks/use-api";
import { currency } from "@/lib/utils";

import type { Farm } from "@/types/farmledger";

import { useFarmStore } from "@/store/farm-store";

const emptyFarm = {
  name: "",
  location: "",
  area: "",
  soilType: "",
  cropType: "",
  plantingDate: "",
  harvestDate: "",
  totalInvested: "0",
  estimatedProfit: "0",
  image: ""
};

export function FarmsClient() {
  const { data, loading, refresh } =
    useApi<Farm[]>("/api/farms");

  const setFarms = useFarmStore(
    (state) => state.setFarms
  );

  const [form, setForm] = useState(emptyFarm);

  const [editing, setEditing] =
    useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setFarms(data);
  }, [data, setFarms]);

  async function submit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setSaving(true);

    const payload = {
      ...form,
      area: Number(form.area),
      totalInvested: Number(
        form.totalInvested
      ),
      estimatedProfit: Number(
        form.estimatedProfit
      )
    };

    const response = await fetch(
      editing
        ? `/api/farms/${editing}`
        : "/api/farms",
      {
        method: editing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    setSaving(false);

    if (!response.ok) {
      toast.error("Could not save farm");
      return;
    }

    toast.success(
      editing
        ? "Farm updated"
        : "Farm created"
    );

    setEditing(null);

    setForm(emptyFarm);

    refresh();
  }

  async function archiveFarm(id: string) {
    await fetch(`/api/farms/${id}`, {
      method: "DELETE"
    });

    toast.success("Farm archived");

    refresh();
  }

  async function uploadImage(file?: File) {
    if (!file) return;

    const body = new FormData();

    body.append("file", file);

    const response = await fetch(
      "/api/upload",
      {
        method: "POST",
        body
      }
    );

    const result = await response.json();

    if (result.url) {
      setForm((current) => ({
        ...current,
        image: result.url
      }));
    }

    toast(
      result.url
        ? "Image uploaded"
        : result.message
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
      {/* FORM */}
      <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-green-500/10 blur-3xl" />

        <CardHeader className="relative z-10">
          <Badge className="w-fit border-0 bg-green-500/15 text-green-300">
            Farm Management
          </Badge>

          <CardTitle className="mt-3 text-2xl font-bold">
            {editing
              ? "Edit farm"
              : "Create new farm"}
          </CardTitle>

          <CardDescription className="text-white/50">
            Track investments, crop cycles,
            soil quality, and expected profit
            for every farm.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <form
            className="grid gap-5"
            onSubmit={submit}
          >
            {[
              ["name", "Farm name"],
              ["location", "Location"],
              ["area", "Area acres"],
              ["soilType", "Soil type"],
              ["cropType", "Primary crop"],
              ["plantingDate", "Planting date"],
              ["harvestDate", "Harvest date"],
              ["totalInvested", "Total invested"],
              ["estimatedProfit", "Estimated profit"]
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
                    key.includes("Date")
                      ? "date"
                      : key === "area" ||
                        key.includes(
                          "Profit"
                        ) ||
                        key.includes(
                          "Invested"
                        )
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
                    "location",
                    "area",
                    "soilType",
                    "cropType"
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

            {/* IMAGE */}
            <div className="space-y-2">
              <Label className="text-white/80">
                Farm image
              </Label>

              <div className="flex gap-3">
                <Input
                  value={form.image}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      image:
                        event.target.value
                    }))
                  }
                  placeholder="https://..."
                  className="
                    h-12 rounded-2xl
                    border-white/10
                    bg-white/[0.03]
                  "
                />

                <label
                  className="
                    flex h-12 w-12 cursor-pointer
                    items-center justify-center
                    rounded-2xl
                    border border-white/10
                    bg-white/[0.04]
                    hover:bg-white/[0.08]
                  "
                >
                  <Upload className="h-4 w-4 text-white/70" />

                  <input
                    className="sr-only"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      uploadImage(
                        event.target
                          .files?.[0]
                      )
                    }
                  />
                </label>
              </div>
            </div>

            {/* BUTTON */}
            <Button
              disabled={saving}
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
              <Plus className="h-4 w-4" />

              {editing
                ? "Update farm"
                : "Create farm"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* RIGHT SIDE */}
      <section className="space-y-5">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Farm portfolio
            </h2>

            <p className="mt-1 text-white/50">
              Multiple farms, analytics,
              crop workflow, and profit
              tracking.
            </p>
          </div>

          <Badge className="bg-white/5 text-white">
            {data?.length ?? 0} Farms
          </Badge>
        </div>

        {/* EMPTY */}
        {!loading && !data?.length && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-14">
            <EmptyState
              icon={Archive}
              title="No farms yet"
              description="Create your first farm to unlock analytics, reminders, crop tracking, and financial forecasting."
            />
          </div>
        )}

        {/* CARDS */}
        <div className="grid gap-5 md:grid-cols-2">
          {data?.map((farm, index) => (
            <motion.div
              key={farm.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.06
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
                {/* IMAGE */}
                <div className="relative h-52 overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${
                        farm.image ||
                        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop"
                      })`
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#081018] via-[#081018]/20 to-transparent" />

                  <Badge className="absolute left-4 top-4 border-0 bg-green-500/20 text-green-300 backdrop-blur-xl">
                    {farm.status}
                  </Badge>
                </div>

                <CardContent className="space-y-5 p-5">
                  {/* TITLE */}
                  <div>
                    <h3 className="text-2xl font-bold">
                      {farm.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-white/50">
                      <MapPin className="h-4 w-4" />
                      {farm.location}
                    </div>
                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-2 text-white/40">
                        <Tractor className="h-4 w-4" />
                        <span className="text-xs">
                          Area
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-bold">
                        {farm.area} ac
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-2 text-white/40">
                        <Sprout className="h-4 w-4" />
                        <span className="text-xs">
                          Crop
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-bold">
                        {farm.cropType}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-2 text-white/40">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs">
                          Profit
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-bold text-green-400">
                        {currency(
                          farm.estimatedProfit
                        )}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      asChild
                      size="sm"
                      className="
                        rounded-xl
                        bg-green-500
                        text-black
                        hover:bg-green-400
                      "
                    >
                      <Link
                        href={`/farms/${farm.id}`}
                      >
                        Details
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(farm.id);

                        setForm({
                          name: farm.name,
                          location:
                            farm.location,
                          area: String(
                            farm.area
                          ),
                          soilType:
                            farm.soilType,
                          cropType:
                            farm.cropType,
                          plantingDate: "",
                          harvestDate: "",
                          totalInvested:
                            String(
                              farm.totalInvested
                            ),
                          estimatedProfit:
                            String(
                              farm.estimatedProfit
                            ),
                          image:
                            farm.image ??
                            ""
                        });
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() =>
                        archiveFarm(farm.id)
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
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

