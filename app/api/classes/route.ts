import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function getAdminIdFromRequest(request: Request): string {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    throw new Error("No Token");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is undefined!");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string; role: string };
  return decoded.userId;
}

export async function GET() {
  try {
    const classes = await prisma.classes.findMany({
      include: {
        students: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
          },
        },
        _count: {
          select: { students: true },
        },
      },
      orderBy: { created_at: "asc" },
    });
    return Response.json(classes);
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { error: "Failed to Fetch Classes." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminId = getAdminIdFromRequest(request);

    const body = await request.json();
    const { nameEn, nameAr, studentsPreview } = body;

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
        adminId, // <-- was HARDCODED_ADMIN_ID
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
        _count: { select: { students: true } },
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error: any) {
    console.error("Error creating class:", error);

    if (error.message === "No Token" || error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 },
    );
  }
}