import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessFarm, requireUser } from "@/lib/api";
import { farmSchema } from "@/lib/validation";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireUser();
  if (gate.response) return gate.response;
  if (!(await canAccessFarm(id, gate.user))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const farm = await prisma.farm.findUnique({
    where: { id },
    include: { crops: true, transactions: { orderBy: { createdAt: "desc" } }, weatherData: { orderBy: { createdAt: "desc" }, take: 10 } }
  });
  return NextResponse.json(farm);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireUser();
  if (gate.response) return gate.response;
  if (!(await canAccessFarm(id, gate.user))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = farmSchema.partial().safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const farm = await prisma.farm.update({
    where: { id },
    data: {
      ...parsed.data,
      image: parsed.data.image || undefined,
      plantingDate: parsed.data.plantingDate ? new Date(parsed.data.plantingDate) : undefined,
      harvestDate: parsed.data.harvestDate ? new Date(parsed.data.harvestDate) : undefined
    }
  });
  return NextResponse.json(farm);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireUser();
  if (gate.response) return gate.response;
  if (!(await canAccessFarm(id, gate.user))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.farm.update({ where: { id }, data: { status: "archived" } });
  return NextResponse.json({ ok: true });
}
