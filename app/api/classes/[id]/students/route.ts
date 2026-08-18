import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: classId } = await params;
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 },
      );
    }

    const updatedClass = await prisma.classes.update({
      where: { id: classId },
      data: {
        students: {
          connect: { id: studentId },
        },
      },
      include: {
        students: { select: { id: true, nameEn: true, nameAr: true } },
        _count: { select: { students: true } },
      },
    });

    return NextResponse.json(updatedClass, { status: 200 });
  } catch (error) {
    console.error("Error adding student to class:", error);
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 },
    );
  }
}
