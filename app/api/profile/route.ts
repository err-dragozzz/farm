import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";
import { profileSchema } from "@/lib/validation";

export async function GET() {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const user = await prisma.user.findUnique({
    where: { id: gate.user.id },
    select: { id: true, name: true, email: true, phone: true, avatar: true, image: true, language: true, darkMode: true, role: true, createdAt: true }
  });
  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const user = await prisma.user.update({
    where: { id: gate.user.id },
    data: parsed.data.avatar ? { ...parsed.data, image: parsed.data.avatar } : parsed.data,
    select: { id: true, name: true, email: true, phone: true, avatar: true, image: true, language: true, darkMode: true, role: true }
  });
  return NextResponse.json(user);
}
