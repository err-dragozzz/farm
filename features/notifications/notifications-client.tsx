
"use client";

import type React from "react";

import { useMemo, useState } from "react";

import { toast } from "sonner";

import {
  BellRing,
  CheckCircle2,
  Plus,
  Clock3,
  Sparkles,
  AlertTriangle,
  Activity
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

import { EmptyState } from "@/components/ui/empty-state";

import { Badge } from "@/components/ui/badge";

import { useApi } from "@/hooks/use-api";

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function NotificationsClient() {
  const { data, refresh } =
    useApi<Notification[]>(
      "/api/notifications"
    );

  const [form, setForm] =
    useState({
      title: "",
      message: ""
    });

  const unreadCount = useMemo(
    () =>
      data?.filter(
        (item) => !item.read
      ).length ?? 0,
    [data]
  );

  async function submit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const response =
      await fetch(
        "/api/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(form)
        }
      );

    if (!response.ok) {
      return toast.error(
        "Could not create reminder"
      );
    }

    setForm({
      title: "",
      message: ""
    });

    toast.success(
      "Reminder created"
    );

    refresh();
  }

  async function markRead(
    id: string
  ) {
    await fetch(
      `/api/notifications/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          read: true
        })
      }
    );

    refresh();
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
          from-amber-500/10
          via-[#0f172a]
          to-[#081018]
          p-8
          shadow-[0_0_70px_rgba(245,158,11,0.08)]
        "
      >
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <Badge className="border-0 bg-amber-500/15 text-amber-300">
              Smart Farm Alerts
            </Badge>

            <h1 className="mt-5 text-4xl font-black tracking-tight">
              Intelligent farming
              notifications &
              reminders
            </h1>

            <p className="mt-4 max-w-2xl text-white/55">
              Track irrigation,
              fertilizer schedules,
              payment due alerts,
              weather updates, and
              crop tasks in one
              place.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-amber-500/10 p-4">
                <BellRing className="h-7 w-7 text-amber-400" />
              </div>

              <div>
                <p className="text-sm text-white/50">
                  Unread Alerts
                </p>

                <h3 className="mt-1 text-3xl font-black text-amber-300">
                  {unreadCount}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* CREATE REMINDER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
        >
          <Card className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-500/10 p-3">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>

                <div>
                  <CardTitle>
                    Create Reminder
                  </CardTitle>

                  <CardDescription>
                    Smart farming
                    task alerts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form
                className="space-y-5"
                onSubmit={submit}
              >
                <div className="space-y-2">
                  <Label>
                    Reminder Title
                  </Label>

                  <Input
                    value={form.title}
                    onChange={(event) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          title:
                            event
                              .target
                              .value
                        })
                      )
                    }
                    required
                    className="
                      h-12
                      rounded-2xl
                      border-white/10
                      bg-white/[0.03]
                    "
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Reminder Message
                  </Label>

                  <Input
                    value={form.message}
                    onChange={(event) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          message:
                            event
                              .target
                              .value
                        })
                      )
                    }
                    required
                    className="
                      h-12
                      rounded-2xl
                      border-white/10
                      bg-white/[0.03]
                    "
                  />
                </div>

                <Button
                  className="
                    h-12
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-amber-500
                    to-orange-500
                    text-white
                    shadow-[0_0_35px_rgba(245,158,11,0.22)]
                    hover:opacity-90
                  "
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* NOTIFICATIONS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.08
          }}
          className="space-y-4"
        >
          {!data?.length && (
            <EmptyState
              icon={BellRing}
              title="No notifications"
              description="Create reminders for farming tasks and payment follow-ups."
            />
          )}

          {data?.map(
            (item, index) => (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay:
                    index * 0.05
                }}
              >
                <Card
                  className={`
                    group rounded-3xl
                    border
                    backdrop-blur-2xl
                    transition-all duration-300
                    hover:-translate-y-1
                    ${
                      item.read
                        ? "border-white/10 bg-white/[0.03]"
                        : "border-amber-500/20 bg-amber-500/[0.04]"
                    }
                  `}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                      <div className="flex gap-4">
                        <div
                          className={`
                            rounded-2xl p-3
                            ${
                              item.read
                                ? "bg-white/[0.05]"
                                : "bg-amber-500/10"
                            }
                          `}
                        >
                          {item.read ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-300" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold">
                              {item.title}
                            </h3>

                            <Badge
                              className={
                                item.read
                                  ? "bg-emerald-500/15 text-emerald-300"
                                  : "bg-amber-500/15 text-amber-300"
                              }
                            >
                              {item.read
                                ? "Read"
                                : "New"}
                            </Badge>
                          </div>

                          <p className="mt-2 text-sm leading-7 text-white/60">
                            {item.message}
                          </p>

                          <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
                            <div className="flex items-center gap-1">
                              <Clock3 className="h-3 w-3" />
                              Recent alert
                            </div>

                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              Farm monitoring
                            </div>
                          </div>
                        </div>
                      </div>

                      {!item.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            markRead(
                              item.id
                            )
                          }
                          className="
                            rounded-xl
                            border-amber-500/20
                            bg-amber-500/10
                            text-amber-200
                            hover:bg-amber-500/20
                          "
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Done
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}

