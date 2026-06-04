import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api";
import { aiRequestSchema } from "@/lib/validation";
import { agricultureInsight } from "@/services/ai";

export async function POST(request: NextRequest) {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const parsed = aiRequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(agricultureInsight("insights", parsed.data));
}
