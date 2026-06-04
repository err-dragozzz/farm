"use client";

import { Suspense } from "react";
import LoginContent from "./login-content";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}