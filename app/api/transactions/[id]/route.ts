import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessFarm, requireUser } from "@/lib/api";
import { transactionSchema } from "@/lib/validation";

async function getOwned(id: string, userId: string, role: string) {
  return prisma.transaction.findFirst({ where: { id, ...(role === "admin" || role === "manager" ? {} : { userId }) } });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireUser();
  if (gate.response) return gate.response;
  if (!(await getOwned(id, gate.user.id, gate.user.role))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = transactionSchema.partial().safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.farmId && !(await canAccessFarm(parsed.data.farmId, gate.user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const transaction = await prisma.transaction.update({ where: { id }, data: parsed.data });
  return NextResponse.json(transaction);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireUser();
  if (gate.response) return gate.response;
  if (!(await getOwned(id, gate.user.id, gate.user.role))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
