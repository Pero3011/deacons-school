import prisma from "@/lib/prisma";
import { handlePrismaError } from "@/lib/handleError";

export async function PUT(request: any, { params }: any) {
  try {
    const { id } = params;
    const body = await request.json();
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const mark = await prisma.marks.findUnique({
      where: { id },
      include: { exam: { include: { class: true } } },
    });

    if (!mark) {
      return Response.json({ error: "الدرجة غير موجودة" }, { status: 404 });
    }

    if (userRole !== "SuperAdmin" && mark.exam.class.adminId !== userId) {
      return Response.json({ error: "لا تملك الصلاحية" }, { status: 403 });
    }

    if (
      body.obtainedMark !== undefined &&
      body.obtainedMark > mark.exam.maxMark
    ) {
      return Response.json(
        { error: `الدرجة المدخلة أكبر من الحد الأقصى (${mark.exam.maxMark})` },
        { status: 400 },
      );
    }

    const updated = await prisma.marks.update({
      where: { id },
      data: {
        obtainedMark: body.obtainedMark,
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

    const mark = await prisma.marks.findUnique({
      where: { id },
      include: { exam: { include: { class: true } } },
    });

    if (!mark) {
      return Response.json({ error: "الدرجة غير موجودة" }, { status: 404 });
    }

    if (userRole !== "SuperAdmin" && mark.exam.class.adminId !== userId) {
      return Response.json({ error: "لا تملك الصلاحية" }, { status: 403 });
    }

    await prisma.marks.delete({ where: { id } });

    return Response.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error(error);
    return handlePrismaError(error);
  }
}
