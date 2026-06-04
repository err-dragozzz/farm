import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.enum(["farmer", "manager", "admin"]).default("farmer")
});

export const farmSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  area: z.coerce.number().positive(),
  soilType: z.string().min(2),
  cropType: z.string().min(2),
  plantingDate: z.string().optional().nullable(),
  harvestDate: z.string().optional().nullable(),
  status: z.enum(["active", "archived", "completed"]).default("active"),
  totalInvested: z.coerce.number().min(0).default(0),
  estimatedProfit: z.coerce.number().min(0).default(0),
  image: z.string().url().optional().or(z.literal(""))
});

export const cropSchema = z.object({
  farmId: z.string().min(1),
  name: z.string().min(2),
  variety: z.string().optional(),
  quantity: z.coerce.number().optional(),
  expectedYield: z.coerce.number().optional(),
  actualYield: z.coerce.number().optional(),
  season: z.string().min(2)
});

export const transactionSchema = z.object({
  farmId: z.string().min(1),
  type: z.enum(["income", "expense"]),
  category: z.string().min(2),
  amount: z.coerce.number().nonnegative(),
  quantity: z.coerce.number().optional(),
  pricePerKg: z.coerce.number().optional(),
  buyerName: z.string().optional(),
  vendorName: z.string().optional(),
  notes: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  recurring: z.coerce.boolean().default(false),
  paymentStatus: z.enum(["pending", "paid", "overdue", "cancelled"]).default("paid")
});

export const profileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  language: z.string().min(2).max(8).optional(),
  darkMode: z.boolean().optional()
});

export const notificationSchema = z.object({
  title: z.string().min(2),
  message: z.string().min(2),
  userId: z.string().optional()
});

export const aiRequestSchema = z.object({
  farmId: z.string().optional(),
  crop: z.string().optional(),
  symptoms: z.string().optional(),
  soilType: z.string().optional(),
  location: z.string().optional(),
  budget: z.coerce.number().optional()
});
