import prisma from "@/lib/prisma";
import { handlePrismaError } from "@/lib/handleError";
import bcrypt from "bcrypt";

export async function PUT(request: any, { params }: any) {
  try {
    const { id } = params;
    const body = await request.json();

    const updateData: any = {
      role: body.role,
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      email: body.email,
    };

    if (body.password) {
      updateData.password_hash = await bcrypt.hash(body.password, 10);
    }

    const update = await prisma.user.update({
      where: { id },
      data: updateData,
      omit: { password_hash: true },
    });

    return Response.json(update);
  } catch (error) {
    console.error(error);
    return handlePrismaError(error);
  }
}

export async function DELETE(request: any, { params }: any) {
  try {
    const userRole = request.headers.get("x-user-role")
    if (userRole != "SuperAdmin") {
      return Response.json({error:"Not authorized to DELETE User!"},{status:403})
    }
    const { id } = params;

    await prisma.user.delete({
      where: { id },
    });

    return Response.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error(error);
    return handlePrismaError(error);
  }
}