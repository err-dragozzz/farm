import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";

export async function GET() {
  const gate = await requireRole(["admin"]);
  if (gate.response) return gate.response;
  const [users, farms, transactions, unread] = await Promise.all([
    prisma.user.count(),
    prisma.farm.count(),
    prisma.transaction.count(),
    prisma.notification.count({ where: { read: false } })
  ]);
  return NextResponse.json({ users, farms, transactions, unread, subscriptions: 0, mrr: 0 });
}
