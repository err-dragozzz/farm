"use client";

import Link from "next/link";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  ArrowUpRight,
  Bell,
  DollarSign,
  Plus,
  Sprout,
  Tractor,
  WalletCards,
  Brain,
  CloudRain,
  TrendingUp,
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

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useApi } from "@/hooks/use-api";
import { currency } from "@/lib/utils";

import type { DashboardAnalytics } from "@/types/farmledger";

const colors = [
  "#22c55e",
  "#16cc56",
  "#0ea5e9",
  "#facc15",
  "#14b8a6"
];

export function DashboardOverview() {
  const { data, loading } =
    useApi<DashboardAnalytics>("/api/dashboard");

  if (loading) {
    return (
      <Skeleton className="h-[720px] w-full rounded-3xl bg-white/5" />
    );
  }

  const stats = [
    {
      label: "Total income",
      value: currency(
        data?.totals?.income ?? 0
      ),
      icon: WalletCards,
      glow:
        "from-green-500/20 to-emerald-500/5"
    },

    {
      label: "Total expenses",
      value: currency(
        data?.totals?.expenses ?? 0
      ),
      icon: DollarSign,
      glow:
        "from-red-500/20 to-orange-500/5"
    },

    {
      label: "Net profit",
      value: currency(
        data?.totals?.profit ?? 0
      ),
      icon: TrendingUp,
      glow:
        "from-lime-500/20 to-green-500/5"
    },

    {
      label: "Active farms",
      value: String(
        data?.totals?.farms ?? 0
      ),
      icon: Tractor,
      glow:
        "from-cyan-500/20 to-blue-500/5"
    }
  ];

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            relative overflow-hidden
            rounded-3xl
            border border-white/10
            bg-gradient-to-br
            from-green-500/15
            via-[#0f172a]
            to-[#081018]
            p-8
            shadow-[0_0_60px_rgba(34,197,94,0.08)]
          "
        >
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative z-10">
            <Badge className="border-0 bg-green-500/20 text-green-300">
              AI Agriculture Intelligence
            </Badge>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight">
              Smart farming insights for
              <span className="bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent">
                {" "}
                higher yield & profit
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-white/60">
              Track crop health, analyze
              expenses, forecast income,
              and optimize your farms with
              AI-powered analytics.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="
h-11
rounded-xl
bg-[#22c55e]
px-6
text-white
font-medium
shadow-sm
transition-all
duration-200
hover:bg-[#16a34a]
hover:shadow-lg
active:scale-[0.98]


                "
              >
                <Link href="/income">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Link>
              </Button>

              <Button
                variant="outline"
                className="
                  h-11 rounded-xl
                  border-white/10
                  bg-white/5
                  px-6
                  text-white
                  hover:bg-white/10
                "
              >
                View Analytics
              </Button>
            </div>
          </div>
        </motion.div>

        {/* AI INSIGHTS */}
        <Card className="border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  AI Insights
                </CardTitle>

                <CardDescription>
                  Smart farm intelligence
                </CardDescription>
              </div>

              <Brain className="h-5 w-5 text-green-400" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
              <div className="flex items-start gap-3">
                <Activity className="mt-1 h-4 w-4 text-green-400" />

                <div>
                  <p className="text-sm font-semibold text-green-300">
                    Crop performance stable
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Yield prediction
                    increased by 12%
                    this month.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <CloudRain className="mt-1 h-4 w-4 text-yellow-300" />

                <div>
                  <p className="text-sm font-semibold text-yellow-200">
                    Rain expected tomorrow
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Recommended to delay
                    irrigation.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="mt-1 h-4 w-4 text-cyan-300" />

                <div>
                  <p className="text-sm font-semibold text-cyan-200">
                    Expense optimization
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Fertilizer cost dropped
                    by 8%.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* STATS */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08
            }}
          >
            <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-green-500/30">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.glow} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <CardContent className="relative flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-white/50">
                    {stat.label}
                  </p>

                  <h3 className="mt-3 text-3xl font-black tracking-tight">
                    {stat.value}
                  </h3>

                  <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                    <ArrowUpRight className="h-3 w-3" />
                    +12.4% growth
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <stat.icon className="h-6 w-6 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* CHARTS */}
      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.7fr]">
        {/* REVENUE */}
        <Card className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Revenue Analytics
              </CardTitle>

              <CardDescription>
                Income vs expenses over
                time
              </CardDescription>
            </div>

            <Button
              asChild
              className="rounded-xl bg-green-500 text-black hover:bg-green-400"
            >
              <Link href="/income">
                <Plus className="mr-2 h-4 w-4" />
                Add Sale
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="h-96">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={data?.monthly ?? []}
              >
                <defs>
                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#22c55e"
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="95%"
                      stopColor="#22c55e"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.08)"
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
                  contentStyle={{
                    background:
                      "#0f172a",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius:
                      "16px"
                  }}
                  formatter={(value) =>
                    currency(
                      Number(value)
                    )
                  }
                />

                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  fill="url(#incomeGradient)"
                  strokeWidth={4}
                />

                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#facc15"
                  fill="transparent"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* EXPENSE MIX */}
        <Card className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <CardHeader>
            <CardTitle>
              Expense Mix
            </CardTitle>

            <CardDescription>
              Financial category
              distribution
            </CardDescription>
          </CardHeader>

          <CardContent className="h-96">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={
                    data?.categories ??
                    []
                  }
                  dataKey="value"
                  nameKey="name"
                  innerRadius={85}
                  outerRadius={125}
                  paddingAngle={4}
                >
                  {(data?.categories ??
                    []
                  ).map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        colors[
                          index %
                            colors.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    currency(
                      Number(value)
                    )
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* FARM PERFORMANCE + RECENT ACTIVITY */}
      <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        {/* FARM PERFORMANCE */}
        <Card className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <CardHeader>
            <CardTitle>
              Farm Performance
            </CardTitle>

            <CardDescription>
              Profit comparison by farm
            </CardDescription>
          </CardHeader>

          <CardContent className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={
                  data?.farmPerformance ??
                  []
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="name"
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
                  contentStyle={{
                    background:
                      "#0f172a",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius:
                      "16px"
                  }}
                  formatter={(value) =>
                    currency(
                      Number(value)
                    )
                  }
                />

                <Bar
                  dataKey="profit"
                  fill="#22c55e"
                  radius={[8, 8, 0, 0]}
                />

                <Bar
                  dataKey="estimatedProfit"
                  fill="#84cc16"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RECENT ACTIVITY */}
        <Card className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>
                Recent Activity
              </CardTitle>

              <CardDescription>
                Latest farm transactions
              </CardDescription>
            </div>

            <Bell className="h-5 w-5 text-green-400" />
          </CardHeader>

          <CardContent className="space-y-4">
            {(data?.recentTransactions ??
              []
            )
              .slice(0, 5)
              .map((tx) => (
                <div
                  key={tx.id}
                  className="
                    flex items-center justify-between
                    rounded-2xl
                    border border-white/10
                    bg-white/[0.03]
                    p-4
                  "
                >
                  <div>
                    <p className="font-medium text-white">
                      {tx.category}
                    </p>

                    <p className="text-xs text-white/50">
                      {tx.farmName ??
                        tx.farm?.name}
                    </p>
                  </div>

                  <Badge
                    className={
                      tx.type ===
                      "income"
                        ? "bg-green-500/20 text-green-300 border-0"
                        : "bg-yellow-500/20 text-yellow-300 border-0"
                    }
                  >
                    {currency(tx.amount)}
                  </Badge>
                </div>
              ))}

            {!(data?.recentTransactions ??
              []
            ).length && (
              <div
                className="
                  flex items-center gap-3
                  rounded-2xl
                  border border-dashed border-white/10
                  bg-white/[0.02]
                  p-5
                  text-sm text-white/50
                "
              >
                <Sprout className="h-4 w-4 text-green-400" />

                Add transactions to
                unlock analytics.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}