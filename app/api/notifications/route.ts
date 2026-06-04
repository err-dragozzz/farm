import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";
import { notificationSchema } from "@/lib/validation";

export async function GET() {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const notifications = await prisma.notification.findMany({
    where: gate.user.role === "admin" ? {} : { userId: gate.user.id },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(notifications);
}

export async function POST(request: NextRequest) {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const parsed = notificationSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const notification = await prisma.notification.create({
    data: {
      title: parsed.data.title,
      message: parsed.data.message,
      userId: gate.user.role === "admin" && parsed.data.userId ? parsed.data.userId : gate.user.id
    }
  });
  return NextResponse.json(notification, { status: 201 });
}
