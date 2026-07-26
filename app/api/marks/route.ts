import prisma from "@/lib/prisma";
import { handlePrismaError } from "@/lib/handleError";

export async function GET() {
  try {
    const marks = await prisma.marks.findMany();
    return Response.json(marks);
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function POST(request: any) {
    try {
        const body = await request.json();

        const exam = await prisma.exams.findUnique({
            where: { id: body.examId },
        });

        if (!exam) {
            return Response.json({ error: "الامتحان غير موجود" }, { status: 404 });
        }

        if (body.obtainedMark > exam.maxMark) {
            return Response.json(
                { error: `الدرجة المدخلة أكبر من الحد الأقصى (${exam.maxMark})` },
                { status: 400 },
            );
        }

        const newMark = await prisma.marks.create({
            data: {
                studentId: body.studentId,
                examId: body.examId,
                obtainedMark: body.obtainedMark,
            },
        });

        return Response.json(newMark);
    } catch (error: any) {
        console.error(error);
        return handlePrismaError(error)
    }
}
