import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: "SuperAdmin" },
  });

  if (existingSuperAdmin) {
    console.log("فيه SuperAdmin موجود بالفعل، لن يتم إنشاء واحد جديد.");
    return;
  }

  const hashedPassword = await bcrypt.hash("ChangeMe123!", 10);

  const superAdmin = await prisma.user.create({
    data: {
      role: "SuperAdmin",
      nameAr: "المدير العام",
      nameEn: "Super Admin",
      email: "superadmin@deacons-school.com",
      password_hash: hashedPassword,
    },
  });

  console.log("تم إنشاء أول SuperAdmin بنجاح:");
  console.log({ id: superAdmin.id, email: superAdmin.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
