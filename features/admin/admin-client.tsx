
"use client";

import { motion } from "framer-motion";

import {
  Users,
  Tractor,
  Receipt,
  Bell,
  Trash2,
  ShieldCheck,
  Activity,
  TrendingUp
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { useApi } from "@/hooks/use-api";

import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    farms: number;
    transactions: number;
  };
};

type Stats = {
  users: number;
  farms: number;
  transactions: number;
  unread: number;
  subscriptions: number;
  mrr: number;
};

export function AdminClient() {
  const { data: stats } =
    useApi<Stats>(
      "/api/admin/stats"
    );

  const {
    data: users,
    refresh
  } = useApi<User[]>(
    "/api/admin/users"
  );

  async function removeUser(
    id: string
  ) {
    const response =
      await fetch(
        `/api/admin/users/${id}`,
        {
          method: "DELETE"
        }
      );

    if (!response.ok) {
      return toast.error(
        "Could not delete user"
      );
    }

    toast.success(
      "User deleted"
    );

    refresh();
  }

  const cards = [
    {
      label: "Users",
      value:
        stats?.users ?? 0,
      icon: Users,
      glow:
        "from-cyan-500/20 to-blue-500/5"
    },

    {
      label: "Farms",
      value:
        stats?.farms ?? 0,
      icon: Tractor,
      glow:
        "from-green-500/20 to-lime-500/5"
    },

    {
      label: "Transactions",
      value:
        stats?.transactions ??
        0,
      icon: Receipt,
      glow:
        "from-yellow-500/20 to-orange-500/5"
    },

    {
      label:
        "Unread Alerts",
      value:
        stats?.unread ?? 0,
      icon: Bell,
      glow:
        "from-red-500/20 to-pink-500/5"
    }
  ];

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
          from-cyan-500/10
          via-[#0f172a]
          to-[#081018]
          p-8
          shadow-[0_0_60px_rgba(34,197,94,0.08)]
        "
      >
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <Badge className="border-0 bg-cyan-500/15 text-cyan-300">
              System Administration
            </Badge>

            <h1 className="mt-5 text-4xl font-black tracking-tight">
              FarmLedger Admin
              Control Center
            </h1>

            <p className="mt-3 max-w-2xl text-white/55">
              Monitor users,
              platform activity,
              subscriptions,
              farms, alerts, and
              financial operations
              across the entire
              system.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-cyan-500/10 p-4">
                <ShieldCheck className="h-7 w-7 text-cyan-400" />
              </div>

              <div>
                <p className="text-sm text-white/50">
                  Platform Status
                </p>

                <h3 className="mt-1 text-2xl font-bold text-green-400">
                  Operational
                </h3>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          (item, index) => (
            <motion.div
              key={item.label}
              initial={{
                opacity: 0,
                y: 18
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay:
                  index * 0.08
              }}
            >
              <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30">
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
                      {item.label}
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-tight">
                      {item.value}
                    </h2>

                    <div className="mt-4 flex items-center gap-2 text-xs text-cyan-400">
                      <TrendingUp className="h-3 w-3" />
                      Live system data
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <item.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
      </section>

      {/* USERS */}
      <motion.div
        initial={{
          opacity: 0,
          y: 18
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
                User Management
              </CardTitle>

              <CardDescription className="mt-1 text-white/50">
                Manage customer
                accounts, farms,
                roles, and ledger
                activity.
              </CardDescription>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              {users?.length ?? 0}
              {" "}Active Users
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {users?.map(
              (
                user,
                index
              ) => (
                <motion.div
                  key={user.id}
                  initial={{
                    opacity: 0,
                    y: 12
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay:
                      index *
                      0.04
                  }}
                  className="
                    group flex flex-wrap
                    items-center justify-between
                    gap-4
                    rounded-3xl
                    border border-white/10
                    bg-white/[0.03]
                    p-5
                    transition-all duration-300
                    hover:border-cyan-500/20
                    hover:bg-white/[0.05]
                  "
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-lg font-bold text-black shadow-lg">
                      {user.name
                        ?.charAt(
                          0
                        )
                        ?.toUpperCase() ??
                        "U"}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        {user.name ??
                          "Unnamed User"}
                      </h3>

                      <p className="text-sm text-white/45">
                        {
                          user.email
                        }
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge className="border-0 bg-cyan-500/15 text-cyan-300">
                          {
                            user.role
                          }
                        </Badge>

                        <Badge
                          variant="outline"
                          className="border-white/10 bg-white/[0.03]"
                        >
                          {
                            user
                              ._count
                              .farms
                          }{" "}
                          farms
                        </Badge>

                        <Badge
                          variant="outline"
                          className="border-white/10 bg-white/[0.03]"
                        >
                          {
                            user
                              ._count
                              .transactions
                          }{" "}
                          tx
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">
                    <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50 lg:block">
                      Joined{" "}
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </div>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-2xl"
                      onClick={() =>
                        removeUser(
                          user.id
                        )
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </motion.div>
              )
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

