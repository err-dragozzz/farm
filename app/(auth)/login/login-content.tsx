"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams
} from "next/navigation";

import { signIn } from "next-auth/react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { toast } from "sonner";

import { Leaf } from "lucide-react";

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

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export default function LoginContent() {
  const router = useRouter();

  const params = useSearchParams();

  const form = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),

    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(
    values: z.infer<typeof schema>
  ) {
    const result = await signIn(
      "credentials",
      {
        ...values,
        redirect: false
      }
    );

    if (result?.error) {
      toast.error(
        "Invalid email or password"
      );

      return;
    }

    router.push(
      params.get("callbackUrl") ??
        "/dashboard"
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center farm-gradient px-4 py-10">
      <Card className="glass-panel w-full max-w-md">
        <CardHeader>
          <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-md">
            <Leaf className="h-6 w-6" />
          </div>

          <CardTitle className="text-2xl">
            Welcome back
          </CardTitle>

          <CardDescription>
            Sign in to manage your
            farms, cash flow,
            reminders, and AI
            insights.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(
              onSubmit
            )}
          >
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...form.register("email")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...form.register(
                  "password"
                )}
              />
            </div>

            <Button
              className="w-full"
              disabled={
                form.formState
                  .isSubmitting
              }
            >
              Sign in
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                signIn("google", {
                  callbackUrl:
                    "/dashboard"
                })
              }
            >
              Continue with Google
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link
              className="text-primary hover:underline"
              href="/forgot-password"
            >
              Forgot password?
            </Link>

            <Link
              className="text-primary hover:underline"
              href="/signup"
            >
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}