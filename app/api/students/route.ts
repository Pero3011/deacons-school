import { NextRequest, NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/handleError";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.students.findMany();

    return NextResponse.json(students);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newStudent = await prisma.students.create({
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        classId: body.classId,
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return handlePrismaError(error);
  }
}
