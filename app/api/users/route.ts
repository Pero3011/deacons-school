import { handlePrismaError } from "@/lib/handleError";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
    try {
      const users = await prisma.user.findMany({
        omit: {
          password_hash: true,
        },
      });

      return Response.json(users);
    } catch (error: any) {
      console.error(error);
      return Response.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
    }
}

export async function POST(request: any) {
    try {
      const body = await request.json();

      const passwordHashed = await bcrypt.hash(body.password, 10);

      const newUser = await prisma.user.create({
        data: {
          role: body.role,
          nameAr: body.nameAr,
          nameEn: body.nameEn,
          email: body.email,
          password_hash: passwordHashed,
        },
        omit: {
          password_hash: true,
        },
      });

      return Response.json(newUser);
    } catch (error: any) {
        console.error(error);
        return handlePrismaError(error);
      }

}