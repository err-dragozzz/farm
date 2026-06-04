import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessFarm, requireUser } from "@/lib/api";
import { cropSchema } from "@/lib/validation";

export async function GET() {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const crops = await prisma.crop.findMany({
    where: gate.user.role === "admin" || gate.user.role === "manager" ? {} : { farm: { userId: gate.user.id } },
    include: { farm: { select: { name: true, cropType: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(crops);
}

export async function POST(request: NextRequest) {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const parsed = cropSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  if (!(await canAccessFarm(parsed.data.farmId, gate.user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const crop = await prisma.crop.create({ data: parsed.data });
  return NextResponse.json(crop, { status: 201 });
}
