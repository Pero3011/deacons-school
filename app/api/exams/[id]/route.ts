import prisma from "@/lib/prisma";
import { handlePrismaError } from "@/lib/handleError";

export async function PUT(request: any, { params }: any) {
  try {
    const { id } = params;
    const body = await request.json();
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const exam = await prisma.exams.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!exam) {
      return Response.json({ error: "الامتحان غير موجود" }, { status: 404 });
    }

    if (userRole !== "SuperAdmin" && exam.class.adminId !== userId) {
      return Response.json({ error: "لا تملك الصلاحية" }, { status: 403 });
    }

    const updated = await prisma.exams.update({
      where: { id },
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        maxMark: body.maxMark,
        term: body.term,
        classId: body.classId,
        subjectId: body.subjectId,
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error(error);
    return handlePrismaError(error);
  }
}

export async function DELETE(request: any, { params }: any) {
  try {
    const { id } = params;
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const exam = await prisma.exams.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!exam) {
      return Response.json({ error: "الامتحان غير موجود" }, { status: 404 });
    }

    if (userRole !== "SuperAdmin" && exam.class.adminId !== userId) {
      return Response.json({ error: "لا تملك الصلاحية" }, { status: 403 });
    }

    await prisma.exams.delete({ where: { id } });

    return Response.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error(error);
    return handlePrismaError(error);
  }
}
