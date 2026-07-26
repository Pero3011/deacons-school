import { handlePrismaError } from "@/lib/handleError";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
      const classes = await prisma.classes.findMany();
      return Response.json(classes);
    } catch (error: any) {
        console.error(error)
        return Response.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
    }
}

export async function POST(request: any) {
    try {
      const body = await request.json();
      const newClass = await prisma.classes.create({
        data: {
          nameAr: body.nameAr,
          nameEn: body.nameEn,
          adminId: body.adminId,
        },
      });

      return Response.json(newClass);
    } catch (error: any) {
        console.error(error);
        return handlePrismaError(error);
    }
}