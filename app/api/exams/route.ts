import { handlePrismaError } from "@/lib/handleError";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
      const exams = await prisma.exams.findMany();
      return Response.json(exams);
    } catch (error: any) {
      console.error(error);
      return Response.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
    }
}

export async function POST(request: any) {
    try {
      const body = await request.json();

      const newExam = await prisma.exams.create({
        data: {
          nameAr: body.nameAr,
          nameEn: body.nameEn,
          maxMark: body.maxMark,
          term: body.term,
          classId: body.classId,
          subjectId: body.subjectId,
        },
      });

      return Response.json(newExam);
    } catch (error: any) {
        console.error(error);
        return handlePrismaError(error);
    }
}