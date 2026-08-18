import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { studentId, examId, obtainedMark } = await request.json();

    if (!studentId || !examId || obtainedMark === undefined) {
      return NextResponse.json(
        { error: "studentId, examId and obtainedMark are required" },
        { status: 400 },
      );
    }

    const exam = await prisma.exams.findUnique({ where: { id: examId } });
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    if (obtainedMark < 0 || obtainedMark > exam.maxMark) {
      return NextResponse.json(
        { error: `obtainedMark must be between 0 and ${exam.maxMark}` },
        { status: 400 },
      );
    }

    const mark = await prisma.marks.upsert({
      where: {
        studentId_examId: { studentId, examId },
      },
      update: { obtainedMark },
      create: { studentId, examId, obtainedMark },
    });

    return NextResponse.json(mark, { status: 200 });
  } catch (error) {
    console.error("Error saving mark:", error);
    return NextResponse.json({ error: "Failed to save mark" }, { status: 500 });
  }
}
