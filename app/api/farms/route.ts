import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardRateLimit, requireUser } from "@/lib/api";
import { farmSchema } from "@/lib/validation";

export async function GET() {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const farms = await prisma.farm.findMany({
    where: gate.user.role === "admin" || gate.user.role === "manager" ? {} : { userId: gate.user.id },
    include: { crops: true, transactions: { orderBy: { createdAt: "desc" }, take: 5 } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(farms);
}

export async function POST(request: NextRequest) {
  const limited = guardRateLimit(request, "farms:create", 40);
  if (limited) return limited;
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const parsed = farmSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const farm = await prisma.farm.create({
    data: {
      ...parsed.data,
      image: parsed.data.image || undefined,
      plantingDate: parsed.data.plantingDate ? new Date(parsed.data.plantingDate) : undefined,
      harvestDate: parsed.data.harvestDate ? new Date(parsed.data.harvestDate) : undefined,
      userId: gate.user.id
    }
  });
  return NextResponse.json(farm, { status: 201 });
}
