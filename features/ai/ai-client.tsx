"use client";

import type React from "react";

import { useState } from "react";

import {
  Brain,
  Send,
  Sparkles,
  Bot,
  Activity,
  TrendingUp,
  ShieldCheck,
  Cpu
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

const intents = [
  "crop-recommendation",
  "disease-detection",
  "yield-prediction",
  "expense-optimization",
  "insights"
] as const;

export function AiClient() {
  const [intent, setIntent] =
    useState<
      (typeof intents)[number]
    >("insights");

  const [form, setForm] =
    useState({
      crop: "",
      soilType: "",
      location: "",
      symptoms: "",
      budget: ""
    });

  const [result, setResult] =
    useState<{
      title: string;
      bullets: string[];
      provider: string;
    } | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function submit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setLoading(true);

    try {
      const response =
        await fetch(
          `/api/ai/${intent}`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              ...form,
              budget: Number(
                form.budget || 0
              )
            })
          }
        );

      setResult(
        await response.json()
      );
    } finally {
      setLoading(false);
    }
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
          from-violet-500/10
          via-[#0f172a]
          to-[#081018]
          p-8
          shadow-[0_0_80px_rgba(139,92,246,0.08)]
        "
      >
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <Badge className="border-0 bg-violet-500/15 text-violet-300">
              AI Agriculture Engine
            </Badge>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight">
              Smart farming powered
              by
              <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                {" "}
                artificial intelligence
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-white/55">
              Generate crop
              recommendations,
              disease detection,
              yield prediction, and
              financial optimization
              using intelligent farm
              analytics.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-violet-500/10 p-4">
                <Cpu className="h-7 w-7 text-violet-400" />
              </div>

              <div>
                <p className="text-sm text-white/50">
                  AI Status
                </p>

                <h3 className="mt-1 text-2xl font-bold text-violet-300">
                  Online
                </h3>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* FORM */}
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
                <div className="rounded-2xl bg-violet-500/10 p-3">
                  <Brain className="h-5 w-5 text-violet-400" />
                </div>

                <div>
                  <CardTitle>
                    AI Workspace
                  </CardTitle>

                  <CardDescription>
                    Intelligent farming
                    assistant
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form
                className="space-y-5"
                onSubmit={submit}
              >
                {/* MODULE */}
                <div className="space-y-2">
                  <Label>
                    AI Module
                  </Label>

                  <Select
                    value={intent}
                    onValueChange={(
                      value
                    ) =>
                      setIntent(
                        value as typeof intent
                      )
                    }
                  >
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/[0.03]">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {intents.map(
                        (item) => (
                          <SelectItem
                            key={item}
                            value={item}
                          >
                            {item}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* INPUTS */}
                {Object.keys(
                  form
                ).map((key) => (
                  <div
                    key={key}
                    className="space-y-2"
                  >
                    <Label>
                      {key}
                    </Label>

                    <Input
                      value={
                        form[
                          key as keyof typeof form
                        ]
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            [key]:
                              event
                                .target
                                .value
                          })
                        )
                      }
                      className="
                        h-12
                        rounded-2xl
                        border-white/10
                        bg-white/[0.03]
                        backdrop-blur-xl
                        focus:border-violet-500/40
                      "
                    />
                  </div>
                ))}

                <Button
                  className="
                    h-12
                    w-full
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-500
                    to-cyan-500
                    text-white
                    shadow-[0_0_35px_rgba(139,92,246,0.25)]
                    hover:opacity-90
                  "
                  disabled={loading}
                >
                  <Send className="mr-2 h-4 w-4" />

                  {loading
                    ? "Generating..."
                    : "Generate Insight"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* RESULTS */}
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
            delay: 0.1
          }}
        >
          <Card className="h-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
            <CardHeader className="flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-violet-500/10 p-4">
                  <Bot className="h-6 w-6 text-violet-400" />
                </div>

                <div>
                  <CardTitle className="text-2xl">
                    {result?.title ??
                      "AI Insights"}
                  </CardTitle>

                  <CardDescription>
                    Provider:{" "}
                    {result?.provider ??
                      "FarmLedger AI"}
                  </CardDescription>
                </div>
              </div>

              <Badge className="border-0 bg-violet-500/15 text-violet-300">
                Live AI
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              {(result?.bullets ?? [
                "Run an AI module to generate advanced agronomy and financial recommendations.",
                "Analyze crop conditions and improve farming decisions.",
                "Get AI-powered predictions and optimization insights."
              ]).map(
                (
                  line,
                  index
                ) => (
                  <motion.div
                    key={line}
                    initial={{
                      opacity: 0,
                      x: -10
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    transition={{
                      delay:
                        index * 0.08
                    }}
                    className="
                      group rounded-3xl
                      border border-white/10
                      bg-white/[0.03]
                      p-5
                      transition-all duration-300
                      hover:border-violet-500/20
                      hover:bg-white/[0.05]
                    "
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 rounded-xl bg-violet-500/10 p-2">
                        <Sparkles className="h-4 w-4 text-violet-300" />
                      </div>

                      <div>
                        <p className="leading-7 text-white/80">
                          {line}
                        </p>

                        <div className="mt-4 flex items-center gap-3 text-xs text-violet-300">
                          <Activity className="h-3 w-3" />
                          AI confidence
                          high

                          <TrendingUp className="ml-3 h-3 w-3" />
                          Optimized
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}

              {/* FOOTER */}
              <div className="rounded-3xl border border-violet-500/15 bg-violet-500/5 p-5">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-violet-500/10 p-3">
                    <ShieldCheck className="h-5 w-5 text-violet-400" />
                  </div>

                  <div>
                    <p className="font-semibold text-violet-300">
                      AI Engine Active
                    </p>

                    <p className="mt-1 text-sm text-white/55">
                      FarmLedger AI is
                      continuously
                      analyzing farming,
                      weather, and
                      financial patterns.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

