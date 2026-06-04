import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export type ApiUser = {
  id: string;
  role: "farmer" | "manager" | "admin";
  email?: string | null;
  name?: string | null;
};

export async function currentUser(): Promise<ApiUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name
  };
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, response: null };
}

export async function requireRole(roles: ApiUser["role"][]) {
  const gate = await requireUser();
  if (!gate.user) return gate;
  if (!roles.includes(gate.user.role)) {
    return { user: gate.user, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return gate;
}

export function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "local";
}

export function guardRateLimit(request: NextRequest, label: string, limit?: number) {
  const result = rateLimit(`${label}:${clientKey(request)}`, limit);
  if (!result.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  return null;
}

export async function canAccessFarm(farmId: string, user: ApiUser) {
  if (user.role === "admin" || user.role === "manager") return true;
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      userId: user.id
    },
    select: { id: true }
  });
  return Boolean(farm);
}
