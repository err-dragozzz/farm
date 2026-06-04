import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api";
import { getDashboardAnalytics } from "@/services/analytics";
import { simplePdf, toCsv } from "@/services/export";

export async function GET(request: NextRequest) {
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const format = request.nextUrl.searchParams.get("format");
  const data = await getDashboardAnalytics(gate.user.id, gate.user.role);

  if (format === "csv") {
    const csv = toCsv(data.recentTransactions as unknown as Record<string, unknown>[]);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=farmledger-report.csv"
      }
    });
  }

  if (format === "pdf") {
    const pdf = simplePdf("FarmLedger Profit and Loss Report", [
      `Total income: ${data.totals.income}`,
      `Total expenses: ${data.totals.expenses}`,
      `Net profit: ${data.totals.profit}`,
      `Farms tracked: ${data.totals.farms}`
    ]);
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=farmledger-report.pdf"
      }
    });
  }

  return NextResponse.json(data);
}
