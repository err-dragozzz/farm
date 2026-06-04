import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function number(value: Prisma.Decimal | number | null | undefined) {
  return Number(value ?? 0);
}

export async function getDashboardAnalytics(userId: string, role: string) {
  const farmWhere = role === "admin" || role === "manager" ? {} : { userId };
  const txWhere = role === "admin" || role === "manager" ? {} : { userId };

  const [farms, transactions, notifications] = await Promise.all([
    prisma.farm.findMany({ where: farmWhere, include: { crops: true }, orderBy: { createdAt: "desc" } }),
    prisma.transaction.findMany({ where: txWhere, include: { farm: true }, orderBy: { createdAt: "desc" } }),
    prisma.notification.findMany({ where: role === "admin" ? {} : { userId }, orderBy: { createdAt: "desc" }, take: 8 })
  ]);

  const income = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + number(tx.amount), 0);
  const expenses = transactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + number(tx.amount), 0);

  const monthly = Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - index));
    const month = date.toLocaleString("en", { month: "short" });
    const monthTx = transactions.filter((tx) => tx.createdAt.getMonth() === date.getMonth() && tx.createdAt.getFullYear() === date.getFullYear());
    return {
      month,
      income: monthTx.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + number(tx.amount), 0),
      expenses: monthTx.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + number(tx.amount), 0)
    };
  });

  const categories = transactions
    .filter((tx) => tx.type === "expense")
    .reduce<Record<string, number>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] ?? 0) + number(tx.amount);
      return acc;
    }, {});

  const farmPerformance = farms.map((farm) => {
    const farmTx = transactions.filter((tx) => tx.farmId === farm.id);
    const farmIncome = farmTx.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + number(tx.amount), 0);
    const farmExpenses = farmTx.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + number(tx.amount), 0);
    return {
      id: farm.id,
      name: farm.name,
      cropType: farm.cropType,
      status: farm.status,
      area: farm.area,
      income: farmIncome,
      expenses: farmExpenses,
      profit: farmIncome - farmExpenses,
      estimatedProfit: number(farm.estimatedProfit)
    };
  });

  return {
    totals: {
      income,
      expenses,
      profit: income - expenses,
      farms: farms.length,
      pendingPayments: transactions.filter((tx) => tx.paymentStatus === "pending").reduce((sum, tx) => sum + number(tx.amount), 0)
    },
    monthly,
    categories: Object.entries(categories).map(([name, value]) => ({ name, value })),
    farmPerformance,
    crops: farms.flatMap((farm) => farm.crops.map((crop) => ({ ...crop, farmName: farm.name }))),
    recentTransactions: transactions.slice(0, 8).map((tx) => ({
      ...tx,
      amount: number(tx.amount),
      pricePerKg: number(tx.pricePerKg),
      farmName: tx.farm.name
    })),
    notifications
  };
}
