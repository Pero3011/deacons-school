import { handlePrismaError } from "@/lib/handleError";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
      const students = await prisma.students.findMany();

      return Response.json(students);
    } catch (error: any) {
      console.error(error);
      return Response.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
    }
}

export async function POST(request:any) {
    try {
      const body = await request.json();

      const newStudent = await prisma.students.create({
        data: {
          nameAr: body.nameAr,
          nameEn: body.nameEn,
          classId: body.classId,
        },
      });

      return Response.json(newStudent);
    } catch (error: any) {
        console.error(error);
        return handlePrismaError(error);
    }
}