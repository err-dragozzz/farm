import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const body = await request.json();
  const existing = await prisma.notification.findFirst({
    where: { id, ...(gate.user.role === "admin" ? {} : { userId: gate.user.id }) },
    select: { id: true }
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const notification = await prisma.notification.update({
    where: { id },
    data: { read: Boolean(body.read) }
  });
  return NextResponse.json(notification);
}
