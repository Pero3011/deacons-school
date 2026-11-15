import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { canAccessClass, requireSession } from "@/lib/auth";
import { cleanString, handleError, jsonError, readJson } from "@/lib/api";

type RouteContext = { params: Promise<{ classId: string }> };

const MAX_BATCH = 200;

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const { classId } = await params;
    if (!(await canAccessClass(session, classId))) {
      return jsonError("Class not found", 404);
    }

    const body = await readJson<{ students?: unknown }>(request);
    const students = body?.students;

    if (!Array.isArray(students) || students.length === 0) {
      return jsonError("Please provide a non-empty array of students", 400);
    }
    if (students.length > MAX_BATCH) {
      return jsonError(`At most ${MAX_BATCH} students per request`, 400);
    }

    const cleaned: { nameAr: string; nameEn: string }[] = [];
    for (const s of students) {
      const nameAr = cleanString((s as Record<string, unknown>)?.nameAr, 100);
      const nameEn = cleanString((s as Record<string, unknown>)?.nameEn, 100);
      if (!nameAr || !nameEn) {
        return jsonError("Each student needs a non-empty nameAr and nameEn", 400);
      }
      cleaned.push({ nameAr, nameEn });
    }

    const values = cleaned.flatMap((s) => [s.nameAr, s.nameEn, classId]);
    const placeholders = cleaned
      .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
      .join(", ");

    const result = await db.query(
      `INSERT INTO "Students" ("nameAr", "nameEn", "classId")
       VALUES ${placeholders}
       RETURNING "id", "nameAr", "nameEn", "classId", "created_at"`,
      values,
    );

    return NextResponse.json(
      { message: `Added ${result.rowCount} students`, students: result.rows },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "POST /api/students/[classId]");
  }
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const { classId } = await params;
    if (!(await canAccessClass(session, classId))) {
      return jsonError("Class not found", 404);
    }

    const result = await db.query(
      `SELECT "id", "nameAr", "nameEn", "classId", "created_at"
       FROM "Students" WHERE "classId" = $1 ORDER BY "nameEn"`,
      [classId],
    );

    return NextResponse.json(result.rows); // [] for an empty class, which is valid
  } catch (error) {
    return handleError(error, "GET /api/students/[classId]");
  }
}
