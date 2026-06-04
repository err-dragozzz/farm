import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";
import { simplePdf } from "@/services/export";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireUser();
  if (gate.response) return gate.response;
  const tx = await prisma.transaction.findFirst({
    where: { id, type: "income", ...(gate.user.role === "admin" || gate.user.role === "manager" ? {} : { userId: gate.user.id }) },
    include: { farm: true, user: true }
  });
  if (!tx) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const pdf = simplePdf(`FarmLedger Invoice ${tx.id.slice(0, 8)}`, [
    `Seller: ${tx.user.name ?? tx.user.email}`,
    `Farm: ${tx.farm.name}`,
    `Buyer: ${tx.buyerName ?? "Buyer"}`,
    `Crop/category: ${tx.category}`,
    `Quantity: ${tx.quantity ?? 0} kg`,
    `Price per kg: ${tx.pricePerKg ?? 0}`,
    `Amount due: ${tx.amount}`,
    `Payment status: ${tx.paymentStatus}`
  ]);
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=farmledger-invoice-${tx.id.slice(0, 8)}.pdf`
    }
  });
}
