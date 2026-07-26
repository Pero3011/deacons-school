import prisma from "@/lib/prisma";
import { handlePrismaError } from "@/lib/handleError";

export async function PUT(request: any, { params }: any) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = await prisma.subjects.update({
      where: { id },
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
      },
    });

    return Response.json(updated);
  } catch (error: any) {
    console.error(error);
    return handlePrismaError(error);
  }
}

export async function DELETE(request: any, { params }: any) {
  try {
    const { id } = params;

    await prisma.subjects.delete({
      where: { id },
    });

    return Response.json({ message: "تم الحذف بنجاح" });
  } catch (error: any) {
    console.error(error);
    return handlePrismaError(error);
  }
}