import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// بننشئ الـ Adapter ونديله رابط الاتصال من متغير البيئة
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// عشان نمنع فتح اتصالات جديدة كل مرة بيحصل فيها Hot Reload في وضع التطوير
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
