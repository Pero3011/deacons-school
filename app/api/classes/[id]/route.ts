import prisma from "@/lib/prisma";
import { handlePrismaError } from "@/lib/handleError";

export async function PUT(request: any, { params }: any) {
  try {
    const { id } = params;
    const body = await request.json();
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const classData = await prisma.classes.findUnique({ where: { id } });

    if (!classData) {
      return Response.json({ error: "الفصل غير موجود" }, { status: 404 });
    }

    if (userRole !== "SuperAdmin" && classData.adminId !== userId) {
      return Response.json({ error: "لا تملك الصلاحية" }, { status: 403 });
    }

    const updated = await prisma.classes.update({
      where: { id },
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        adminId: body.adminId,
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

    const classData = await prisma.classes.findUnique({ where: { id } });

    if (!classData) {
      return Response.json({ error: "الفصل غير موجود" }, { status: 404 });
    }

    if (userRole !== "SuperAdmin" && classData.adminId !== userId) {
      return Response.json({ error: "لا تملك الصلاحية" }, { status: 403 });
    }

    await prisma.classes.delete({ where: { id } });

    return Response.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error(error);
    return handlePrismaError(error);
  }
}
