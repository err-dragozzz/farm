import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api";
import { getDashboardAnalytics } from "@/services/analytics";

export async function GET() {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const analytics = await getDashboardAnalytics(gate.user.id, gate.user.role);
  return NextResponse.json(analytics);
}
