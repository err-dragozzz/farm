import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { guardRateLimit } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  const limited = guardRateLimit(request, "forgot-password", 8);
  if (limited) return limited;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() }, select: { id: true } });
  if (user) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Password reset requested",
        message: "Connect an email provider to send reset links from this endpoint in production."
      }
    });
  }

  return NextResponse.json({ ok: true, message: "If an account exists, reset instructions will be sent." });
}
