import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireRole(["admin"]);
  if (gate.response) return gate.response;
  const body = await request.json();
  const user = await prisma.user.update({
    where: { id },
    data: {
      role: body.role,
      name: body.name,
      phone: body.phone
    },
    select: { id: true, name: true, email: true, role: true }
  });
  return NextResponse.json(user);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireRole(["admin"]);
  if (gate.response) return gate.response;
  if (id === gate.user.id) return NextResponse.json({ error: "Admins cannot delete their own account" }, { status: 400 });
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
