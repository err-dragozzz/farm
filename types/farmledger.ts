export type Farm = {
  id: string;
  name: string;
  location: string;
  area: number;
  soilType: string;
  cropType: string;
  status: "active" | "archived" | "completed";
  totalInvested: number;
  estimatedProfit: number;
  image?: string | null;
  crops?: Crop[];
  transactions?: Transaction[];
};

export type Crop = {
  id: string;
  farmId: string;
  name: string;
  variety?: string | null;
  quantity?: number | null;
  expectedYield?: number | null;
  actualYield?: number | null;
  season: string;
  farm?: { name: string; cropType: string };
};

export type Transaction = {
  id: string;
  farmId: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  quantity?: number | null;
  pricePerKg?: number | null;
  buyerName?: string | null;
  vendorName?: string | null;
  notes?: string | null;
  paymentStatus: "pending" | "paid" | "overdue" | "cancelled";
  farm?: { name: string; cropType: string };
  farmName?: string;
  createdAt: string;
};

export type DashboardAnalytics = {
  totals: {
    income: number;
    expenses: number;
    profit: number;
    farms: number;
    pendingPayments: number;
  };
  monthly: Array<{ month: string; income: number; expenses: number }>;
  categories: Array<{ name: string; value: number }>;
  farmPerformance: Array<{ id: string; name: string; cropType: string; income: number; expenses: number; profit: number; estimatedProfit: number }>;
  recentTransactions: Transaction[];
  notifications: Array<{ id: string; title: string; message: string; read: boolean; createdAt: string }>;
};
