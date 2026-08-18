import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: classId } = await params;

    const [students, exams] = await Promise.all([
      prisma.students.findMany({
        where: { classId },
        select: { id: true, nameEn: true, nameAr: true },
        orderBy: { nameEn: "asc" },
      }),
      prisma.exams.findMany({
        where: { classId },
        include: {
          subject: { select: { id: true, nameEn: true, nameAr: true } },
        },
        orderBy: [{ term: "asc" }, { subject: { nameEn: "asc" } }],
      }),
    ]);

    const examIds = exams.map((e) => e.id);

    const marks = examIds.length
      ? await prisma.marks.findMany({
          where: { examId: { in: examIds } },
          select: { studentId: true, examId: true, obtainedMark: true },
        })
      : [];

    // Shape marks as { studentId: { examId: obtainedMark } } for easy lookup
    const marksByStudent: Record<string, Record<string, number>> = {};
    for (const m of marks) {
      if (!marksByStudent[m.studentId]) marksByStudent[m.studentId] = {};
      marksByStudent[m.studentId][m.examId] = m.obtainedMark;
    }

    return NextResponse.json({
      students,
      exams: exams.map((e) => ({
        id: e.id,
        term: e.term,
        maxMark: e.maxMark,
        subject: e.subject,
      })),
      marks: marksByStudent,
    });
  } catch (error) {
    console.error("Error fetching marksheet:", error);
    return NextResponse.json(
      { error: "Failed to fetch marksheet" },
      { status: 500 },
    );
  }
}
