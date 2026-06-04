"use client";

import { motion } from "framer-motion";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  Download,
  FileText,
  TrendingUp,
  Wallet,
  DollarSign,
  Activity
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { useApi } from "@/hooks/use-api";

import { currency } from "@/lib/utils";

import type { DashboardAnalytics } from "@/types/farmledger";

export function ReportsClient() {
  const { data } =
    useApi<DashboardAnalytics>(
      "/api/reports"
    );

  const stats = [
    {
      title: "Total Income",

      value: currency(
        data?.totals?.income ?? 0
      ),

      icon: Wallet,

      glow:
        "from-green-500/20 to-emerald-500/5"
    },

    {
      title: "Total Expenses",

      value: currency(
        data?.totals?.expenses ?? 0
      ),

      icon: DollarSign,

      glow:
        "from-red-500/20 to-orange-500/5"
    },

    {
      title: "Net Profit",

      value: currency(
        data?.totals?.profit ?? 0
      ),

      icon: TrendingUp,

      glow:
        "from-cyan-500/20 to-blue-500/5"
    }
  ];

  return (
    <div className="space-y-6">
      {/* HERO */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
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

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <Badge className="border-0 bg-green-500/15 text-green-300">
              Financial Intelligence
            </Badge>

            <h1 className="mt-5 text-4xl font-black tracking-tight">
              Reports & Analytics
            </h1>

            <p className="mt-3 max-w-2xl text-white/55">
              Monitor profit trends,
              expense growth, and
              financial performance
              across all farms with
              export-ready reporting.
            </p>
          </div>

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
                Export CSV
              </a>
            </Button>

            <Button
              asChild
              className="
                h-11
                rounded-xl
                border
                border-green-500/20
                bg-gradient-to-b
                from-green-500
                to-green-600
                px-6
                font-medium
                text-white
                shadow-[0_4px_20px_rgba(34,197,94,0.18)]
                transition-all
                duration-200
                hover:brightness-110
                hover:shadow-[0_6px_24px_rgba(34,197,94,0.28)]
                active:scale-[0.98]
              "
            >
              <a href="/api/reports?format=pdf">
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </a>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <section className="grid gap-5 md:grid-cols-3">
        {stats.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{
              opacity: 0,
              y: 18
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.08
            }}
          >
            <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30">
              <div
                className={`
                  absolute inset-0
                  bg-gradient-to-br
                  ${item.glow}
                  opacity-0
                  transition-opacity duration-500
                  group-hover:opacity-100
                `}
              />

              <CardContent className="relative flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-white/50">
                    {item.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-black tracking-tight">
                    {item.value}
                  </h2>

                  <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                    <Activity className="h-3 w-3" />
                    Live analytics
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <item.icon className="h-6 w-6 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* CHART */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.2
        }}
      >
        <Card className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Yearly Financial Trend
              </CardTitle>

              <CardDescription className="mt-1 text-white/50">
                Compare income and
                expenses month-wise for
                better financial planning.
              </CardDescription>
            </div>

            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-300">
              2026 Overview
            </div>
          </CardHeader>

          <CardContent className="h-[450px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={
                  data?.monthly ?? []
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.06)"
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#94a3b8"
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#94a3b8"
                  }}
                />

                <Tooltip
                  cursor={{
                    fill:
                      "rgba(255,255,255,0.03)"
                  }}
                  contentStyle={{
                    background:
                      "#0f172a",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    borderRadius:
                      "18px",
                    color: "#fff"
                  }}
                  formatter={(value) =>
                    currency(
                      Number(value ?? 0)
                    )
                  }
                />

                <Bar
                  dataKey="income"
                  fill="#22c55e"
                  radius={[
                    10,
                    10,
                    0,
                    0
                  ]}
                />

                <Bar
                  dataKey="expenses"
                  fill="#facc15"
                  radius={[
                    10,
                    10,
                    0,
                    0
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}