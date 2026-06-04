import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { guardRateLimit } from "@/lib/api";
import { registerSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const limited = guardRateLimit(request, "register", 12);
  if (limited) return limited;

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const password = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      ...parsed.data,
      email: parsed.data.email.toLowerCase(),
      password,
      role: parsed.data.role === "admin" ? "farmer" : parsed.data.role
    },
    select: { id: true, email: true, name: true, role: true }
  });

  return NextResponse.json({ user }, { status: 201 });
}
