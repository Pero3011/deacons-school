import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const classes = await prisma.classes.findMany({
      include: {
        _count: {
          select: { students: true },
        },
      },
      orderBy: { created_at: "asc" },
    });
    return Response.json(classes);
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: "Failed to Fetch Classes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nameEn, nameAr, studentsPreview } = body;

    // Manually specify your local test Admin User ID here
    const HARDCODED_ADMIN_ID =
      body.adminId || "633ae8cf-85b6-40a8-9f3f-3c4be0337795";

    if (!nameEn || !nameAr) {
      return NextResponse.json(
        { error: "Both English and Arabic class names are required." },
        { status: 400 },
      );
    }

    const newClass = await prisma.classes.create({
      data: {
        nameEn,
        nameAr,
        adminId: HARDCODED_ADMIN_ID,
        students: {
          create: (studentsPreview || []).map(
            (student: { nameEn: string; nameAr: string }) => ({
              nameEn: student.nameEn,
              nameAr: student.nameAr,
            }),
          ),
        },
      },
      include: {
        students: true,
        _count: {
          select: { students: true },
        },
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 },
    );
  }
}