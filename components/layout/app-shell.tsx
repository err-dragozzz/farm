
"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import {
  Activity,
  BarChart3,
  Bell,
  Brain,
  CloudSun,
  DollarSign,
  FileText,
  LayoutDashboard,
  Leaf,
  LogOut,
  Moon,
  Sprout,
  Sun,
  Tractor,
  User,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWeather } from "@/hooks/use-weather";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    href: "/farms",
    label: "Farms",
    icon: Tractor
  },
  {
    href: "/crops",
    label: "Crops",
    icon: Sprout
  },
  {
    href: "/expenses",
    label: "Expenses",
    icon: DollarSign
  },
  {
    href: "/income",
    label: "Income",
    icon: BarChart3
  },
  {
    href: "/reports",
    label: "Reports",
    icon: FileText
  },
  {
    href: "/notifications",
    label: "Alerts",
    icon: Bell
  },
  {
    href: "/ai",
    label: "AI Insights",
    icon: Brain
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User
  }
];

export function AppShell({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { data } = useSession();

  const { theme, setTheme } = useTheme();

  const { weather } = useWeather();

  const isAdmin =
    data?.user &&
    "role" in data.user &&
    data.user.role === "admin";

  const navLinks = isAdmin
    ? [
        ...links,
        {
          href: "/admin",
          label: "Admin",
          icon: Users
        }
      ]
    : links;

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.05),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.03),transparent_30%)]" />

      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-[#111827]/95 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col px-5 py-6">
          {/* LOGO */}
          <Link
            href="/dashboard"
            className="mb-10 flex items-center gap-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-500/20 bg-[#1f2937]">
              <Leaf className="h-6 w-6 text-green-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                FarmLedger
              </h1>

              <p className="text-xs text-white/40">
                Smart Agri Finance OS
              </p>
            </div>
          </Link>

          {/* WEATHER CARD */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-[#151f30] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Today
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {weather?.temperature ?? "--"}°C
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  {weather?.city ??
                    "Loading location..."}
                </p>
              </div>

              <CloudSun className="h-9 w-9 text-yellow-400" />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
              <Activity className="h-3 w-3" />

              {weather?.condition ??
                "Fetching weather..."}
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-2">
            {navLinks.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    active
                      ? "border border-green-500/20 bg-[#1f2937] text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />

                  <span>{item.label}</span>

                  {active && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-2 h-8 w-1 rounded-r-full bg-green-400"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* USER CARD */}
          <div className="mt-auto rounded-2xl border border-white/10 bg-[#151f30] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                {data?.user?.name?.charAt(0) ??
                  "F"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {data?.user?.name ??
                    "Farmer"}
                </p>

                <p className="truncate text-xs text-white/40">
                  {data?.user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:pl-72">
        {/* HEADER */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1220]/80 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-5 lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-green-400">
                FARMLEDGER
              </p>

              <h1 className="mt-1 text-xl font-bold">
                Welcome back,{" "}
                {data?.user?.name?.split(
                  " "
                )[0] ?? "Farmer"}{" "}
                🌱
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl border border-white/10 bg-[#151f30]"
                onClick={() =>
                  setTheme(
                    theme === "dark"
                      ? "light"
                      : "dark"
                  )
                }
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition dark:-rotate-90 dark:scale-0" />

                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition dark:rotate-0 dark:scale-100" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl border border-white/10 bg-[#151f30]"
                onClick={() =>
                  signOut({
                    callbackUrl: "/login"
                  })
                }
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* PAGE */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="px-5 py-6 lg:px-10"
        >
          {children}
        </motion.main>
      </div>

      {/* MOBILE NAV */}
      <nav className="fixed inset-x-4 bottom-4 z-40 grid grid-cols-5 gap-2 rounded-2xl border border-white/10 bg-[#111827]/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
        {navLinks
          .slice(0, 5)
          .map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-14 flex-col items-center justify-center rounded-xl text-[11px] transition-all",
                  active
                    ? "bg-[#1f2937] text-green-400"
                    : "text-white/60"
                )}
              >
                <item.icon className="h-4 w-4" />

                <span className="mt-1">
                  {item.label}
                </span>
              </Link>
            );
          })}
      </nav>
    </div>
  );
}

