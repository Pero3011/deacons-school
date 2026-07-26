import prisma from "@/lib/prisma";
import { handlePrismaError } from "@/lib/handleError";

export async function PUT(request: any, { params }: any) {
  try {
    const { id } = params;
    const body = await request.json();
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const attendance = await prisma.attendance.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!attendance) {
      return Response.json({ error: "سجل الحضور غير موجود" }, { status: 404 });
    }

    if (userRole !== "SuperAdmin" && attendance.class.adminId !== userId) {
      return Response.json({ error: "لا تملك الصلاحية" }, { status: 403 });
    }

    const updated = await prisma.attendance.update({
      where: { id },
      data: {
        status: body.status,
        term: body.term,
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

    const attendance = await prisma.attendance.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!attendance) {
      return Response.json({ error: "سجل الحضور غير موجود" }, { status: 404 });
    }

    if (userRole !== "SuperAdmin" && attendance.class.adminId !== userId) {
      return Response.json({ error: "لا تملك الصلاحية" }, { status: 403 });
    }

    await prisma.attendance.delete({ where: { id } });

    return Response.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error(error);
    return handlePrismaError(error);
  }
}
