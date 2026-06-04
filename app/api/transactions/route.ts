import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessFarm, requireUser } from "@/lib/api";
import { transactionSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const type = request.nextUrl.searchParams.get("type") as "income" | "expense" | null;
  const transactions = await prisma.transaction.findMany({
    where: {
      ...(gate.user.role === "admin" || gate.user.role === "manager" ? {} : { userId: gate.user.id }),
      ...(type ? { type } : {})
    },
    include: { farm: { select: { name: true, cropType: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const parsed = transactionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  if (!(await canAccessFarm(parsed.data.farmId, gate.user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const amount = parsed.data.type === "income" && parsed.data.quantity && parsed.data.pricePerKg
    ? parsed.data.quantity * parsed.data.pricePerKg
    : parsed.data.amount;

  const transaction = await prisma.transaction.create({
    data: {
      ...parsed.data,
      image: parsed.data.image || undefined,
      amount,
      userId: gate.user.id
    }
  });
  return NextResponse.json(transaction, { status: 201 });
}
