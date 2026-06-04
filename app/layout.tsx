import type { Metadata, Viewport } from "next";
import type React from "react";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "FarmLedger",
  description: "A production-grade farm management, finance, and analytics SaaS platform.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "FarmLedger",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#287653",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
