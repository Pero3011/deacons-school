import prisma from "@/lib/prisma";
import { handlePrismaError } from "@/lib/handleError";

export async function PUT(request: any, { params }: any) {
  try {
    const { id } = params;
    const body = await request.json();
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const student = await prisma.students.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!student) {
      return Response.json({ error: "الطالب غير موجود" }, { status: 404 });
    }

    if (userRole !== "SuperAdmin" && student.class.adminId !== userId) {
      return Response.json({ error: "لا تملك الصلاحية" }, { status: 403 });
    }

    const updated = await prisma.students.update({
      where: { id },
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
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

    const student = await prisma.students.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!student) {
      return Response.json({ error: "الطالب غير موجود" }, { status: 404 });
    }

    if (userRole !== "SuperAdmin" && student.class.adminId !== userId) {
      return Response.json({ error: "لا تملك الصلاحية" }, { status: 403 });
    }

    await prisma.students.delete({ where: { id } });

    return Response.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error(error);
    return handlePrismaError(error);
  }
}
