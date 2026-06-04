
"use client";

import type React from "react";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { toast } from "sonner";

import {
  Download,
  Upload,
  UserRound,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  Camera
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

import { Badge } from "@/components/ui/badge";

import { useApi } from "@/hooks/use-api";

type Profile = {
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  image?: string;
  language: string;
  darkMode: boolean;
  role: string;
};

export function ProfileClient() {
  const { data, refresh } =
    useApi<Profile>("/api/profile");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    avatar: "",
    language: "en",
    darkMode: false
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name ?? "",
        phone: data.phone ?? "",
        avatar:
          data.avatar ??
          data.image ??
          "",
        language:
          data.language,
        darkMode:
          data.darkMode
      });
    }
  }, [data]);

  async function submit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const response =
      await fetch(
        "/api/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(
            form
          )
        }
      );

    if (!response.ok) {
      return toast.error(
        "Could not save profile"
      );
    }

    toast.success(
      "Profile updated"
    );

    refresh();
  }

  async function uploadAvatar(
    file?: File
  ) {
    if (!file) return;

    const body =
      new FormData();

    body.append(
      "file",
      file
    );

    const response =
      await fetch(
        "/api/upload",
        {
          method: "POST",
          body
        }
      );

    const result =
      await response.json();

    if (result.url) {
      setForm((current) => ({
        ...current,
        avatar: result.url
      }));
    }

    toast(
      result.url
        ? "Avatar uploaded"
        : result.message
    );
  }

  return (
    <div className="space-y-6">
      {/* HERO */}
      <motion.div
        initial={{
          opacity: 0,
          y: 18
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="
          relative overflow-hidden
          rounded-3xl
          border border-white/10
          bg-gradient-to-br
          from-green-500/10
          via-[#0f172a]
          to-[#081018]
          p-8
          shadow-[0_0_60px_rgba(34,197,94,0.08)]
        "
      >
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* AVATAR */}
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
                {form.avatar ? (
                  <img
                    src={
                      form.avatar
                    }
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-12 w-12 text-white/60" />
                )}
              </div>

              <label
                className="
                  absolute bottom-2 right-2
                  flex h-9 w-9 cursor-pointer
                  items-center justify-center
                  rounded-xl
                  bg-green-500
                  text-black
                  shadow-lg
                "
              >
                <Camera className="h-4 w-4" />

                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    uploadAvatar(
                      e.target
                        .files?.[0]
                    )
                  }
                />
              </label>
            </div>

            {/* INFO */}
            <div>
              <Badge className="border-0 bg-green-500/15 text-green-300">
                Account Center
              </Badge>

              <h1 className="mt-4 text-4xl font-black tracking-tight">
                {data?.name ??
                  "Farm User"}
              </h1>

              <p className="mt-2 text-white/55">
                Manage your account,
                security preferences,
                exports, and profile
                information.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                  <Mail className="h-4 w-4 text-green-400" />
                  {data?.email}
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  {data?.role}
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="
                h-12 rounded-2xl
                border-white/10
                bg-white/[0.03]
                px-6
              "
            >
              <a href="/api/reports?format=csv">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </a>
            </Button>

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
              Upgrade Plan
            </Button>
          </div>
        </div>
      </motion.div>

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* LEFT SIDEBAR */}
        <motion.div
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
        >
          <Card className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
            <CardHeader>
              <CardTitle>
                Account Overview
              </CardTitle>

              <CardDescription>
                Quick access account
                information
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-400" />

                  <div>
                    <p className="text-xs text-white/40">
                      Email
                    </p>

                    <p className="text-sm font-medium">
                      {data?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-cyan-400" />

                  <div>
                    <p className="text-xs text-white/40">
                      Phone
                    </p>

                    <p className="text-sm font-medium">
                      {form.phone ||
                        "Not added"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-yellow-400" />

                  <div>
                    <p className="text-xs text-white/40">
                      Language
                    </p>

                    <p className="text-sm font-medium uppercase">
                      {
                        form.language
                      }
                    </p>
                  </div>
                </div>
              </div>

              <label
                className="
                  flex h-12 cursor-pointer
                  items-center justify-center gap-2
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  text-sm
                  transition hover:bg-white/[0.06]
                "
              >
                <Upload className="h-4 w-4" />

                Upload Avatar

                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    uploadAvatar(
                      e.target
                        .files?.[0]
                    )
                  }
                />
              </label>
            </CardContent>
          </Card>
        </motion.div>

        {/* SETTINGS */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
        >
          <Card className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                Account Settings
              </CardTitle>

              <CardDescription>
                Update profile
                details and personal
                preferences
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                className="grid gap-5 md:grid-cols-2"
                onSubmit={submit}
              >
                <div className="space-y-2">
                  <Label>
                    Full Name
                  </Label>

                  <Input
                    value={
                      form.name
                    }
                    onChange={(e) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          name:
                            e
                              .target
                              .value
                        })
                      )
                    }
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Phone Number
                  </Label>

                  <Input
                    value={
                      form.phone
                    }
                    onChange={(e) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          phone:
                            e
                              .target
                              .value
                        })
                      )
                    }
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Language
                  </Label>

                  <Select
                    value={
                      form.language
                    }
                    onValueChange={(
                      language
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          language
                        })
                      )
                    }
                  >
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/[0.03]">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="en">
                        English
                      </SelectItem>

                      <SelectItem value="hi">
                        Hindi
                      </SelectItem>

                      <SelectItem value="es">
                        Spanish
                      </SelectItem>

                      <SelectItem value="fr">
                        French
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Avatar URL
                  </Label>

                  <Input
                    value={
                      form.avatar
                    }
                    onChange={(e) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          avatar:
                            e
                              .target
                              .value
                        })
                      )
                    }
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <Button className="h-11
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
">
                  Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

