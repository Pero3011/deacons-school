import { handlePrismaError } from "@/lib/handleError";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const attendance = await prisma.attendance.findMany();
    return Response.json(attendance);
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function POST(request: any) {
    try {
        const body = await request.json();

        const newAttendance = await prisma.attendance.create({
            data: {
                studentId: body.studentId,
                classId: body.classId,
                attendanceDate: body.attendanceDate,
                status: body.status,
                term: body.term,
            },
        });

        return Response.json(newAttendance);
    } catch (error: any) {
        console.error(error);
        return handlePrismaError(error);
    }
}
