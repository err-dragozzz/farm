import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("FarmLedger@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@farmledger.app" },
    update: {},
    create: {
      name: "FarmLedger Admin",
      email: "admin@farmledger.app",
      password,
      role: Role.admin,
      language: "en"
    }
  });

  const farmer = await prisma.user.upsert({
    where: { email: "farmer@farmledger.app" },
    update: {},
    create: {
      name: "Anaya Green",
      email: "farmer@farmledger.app",
      phone: "+15550101010",
      password,
      role: Role.farmer,
      language: "en"
    }
  });

  const farm = await prisma.farm.upsert({
    where: { id: "seed-riverbend-farm" },
    update: {},
    create: {
      id: "seed-riverbend-farm",
      userId: farmer.id,
      name: "Riverbend Organic Plot",
      location: "Nashik, Maharashtra",
      latitude: 19.9975,
      longitude: 73.7898,
      area: 18.5,
      soilType: "Black cotton soil",
      cropType: "Tomato",
      plantingDate: new Date("2026-01-20"),
      harvestDate: new Date("2026-05-30"),
      totalInvested: 48200,
      estimatedProfit: 96300,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
    }
  });

  await prisma.crop.createMany({
    data: [
      { farmId: farm.id, name: "Tomato", variety: "Roma VF", quantity: 4200, expectedYield: 7800, actualYield: 0, season: "Rabi" },
      { farmId: farm.id, name: "Marigold", variety: "Pusa Narangi", quantity: 900, expectedYield: 1300, actualYield: 1180, season: "Winter" }
    ],
    skipDuplicates: true
  });

  await prisma.transaction.createMany({
    data: [
      { farmId: farm.id, userId: farmer.id, type: "expense", category: "seeds", amount: 7600, vendorName: "AgriMart", notes: "Hybrid tomato seeds" },
      { farmId: farm.id, userId: farmer.id, type: "expense", category: "fertilizer", amount: 13800, vendorName: "SoilCare Co", recurring: true },
      { farmId: farm.id, userId: farmer.id, type: "income", category: "crop sale", amount: 65500, quantity: 2500, pricePerKg: 26.2, buyerName: "FreshRoute Buyers", paymentStatus: "pending" }
    ]
  });

  await prisma.notification.createMany({
    data: [
      { userId: farmer.id, title: "Irrigation window", message: "Tomato plot moisture is trending low. Schedule irrigation today." },
      { userId: farmer.id, title: "Payment follow-up", message: "FreshRoute Buyers has a pending payment of Rs. 65,500." },
      { userId: admin.id, title: "System ready", message: "Seed data is available for production smoke tests." }
    ]
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
