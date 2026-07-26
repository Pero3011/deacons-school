import { handlePrismaError } from "@/lib/handleError";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
      const subjects = await prisma.subjects.findMany();
      return Response.json(subjects);
    } catch (error: any) {
      console.error(error);
      return Response.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
    }
}

export async function POST(request: any) {
    try {
      const body = await request.json();

      const newSubject = await prisma.subjects.create({
        data: {
          nameAr: body.nameAr,
          nameEn: body.nameEn,
        },
      });

      return Response.json(newSubject);
    } catch (error: any) {
      console.error(error);
      return handlePrismaError(error);
    }
}