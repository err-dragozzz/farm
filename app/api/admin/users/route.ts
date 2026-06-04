import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";

export async function GET() {
  const gate = await requireRole(["admin"]);
  if (gate.response) return gate.response;
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { farms: true, transactions: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(users);
}
