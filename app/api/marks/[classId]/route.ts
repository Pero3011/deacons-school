import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { canAccessClass, requireSession } from "@/lib/auth";
import { asId, handleError, jsonError, readJson } from "@/lib/api";
import { isTerm } from "@/lib/constants";

type RouteContext = { params: Promise<{ classId: string }> };

// POST /api/marks/:classId?term=Term1   body: { studentId, subjectId, obtainedMark }
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const { classId } = await params;
    const term = request.nextUrl.searchParams.get("term");
    const body = await readJson<Record<string, unknown>>(request);

    const studentId = asId(body?.studentId);
    const subjectId = asId(body?.subjectId);
    const obtainedMark = body?.obtainedMark;

    if (!studentId || !subjectId) return jsonError("studentId and subjectId are required", 400);
    if (!isTerm(term)) return jsonError("Invalid term", 400);
    if (typeof obtainedMark !== "number" || !Number.isFinite(obtainedMark)) {
      return jsonError("obtainedMark must be a valid number", 400);
    }

    // One lookup: student is in this class, caller may access it, and the exam exists.
    const lookup = await db.query(
      `
      SELECT e."id" AS "examId", e."maxMark"
      FROM public."Students" s
      JOIN public."Classes" c ON c."id" = s."classId"
      JOIN public."Exams" e
        ON e."classId" = s."classId" AND e."subjectId" = $3 AND e."term" = $4::"Term"
      WHERE s."id" = $1 AND s."classId" = $2 AND ($5::boolean OR c."adminId" = $6)
      `,
      [studentId, classId, subjectId, term, session.role === "SuperAdmin", session.userId],
    );

    if (lookup.rows.length === 0) {
      return jsonError("Student or exam not found for this class, subject, and term", 404);
    }

    const { examId } = lookup.rows[0];
    const maxMark = Number(lookup.rows[0].maxMark);

    if (obtainedMark < 0 || obtainedMark > maxMark) {
      return NextResponse.json(
        { error: `Mark must be between 0 and ${maxMark}`, maxMark },
        { status: 400 },
      );
    }

    const result = await db.query(
      `
      INSERT INTO public."Marks" ("studentId", "examId", "obtainedMark")
      VALUES ($1, $2, $3)
      ON CONFLICT ("studentId", "examId")
      DO UPDATE SET "obtainedMark" = EXCLUDED."obtainedMark",
                    "updated_at" = CURRENT_TIMESTAMP
      RETURNING *
      `,
      [studentId, examId, obtainedMark],
    );

    return NextResponse.json({ message: "Mark saved", mark: result.rows[0] });
  } catch (error) {
    return handleError(error, "POST /api/marks/[classId]");
  }
}

// GET /api/marks/:classId?term=Term1
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const { classId } = await params;
    const term = request.nextUrl.searchParams.get("term");

    if (!isTerm(term)) return jsonError("Invalid or missing term", 400);
    if (!(await canAccessClass(session, classId))) {
      return jsonError("Class not found", 404);
    }

    const result = await db.query(
      `
      SELECT
        s."id"       AS "studentId",
        s."nameEn",
        s."nameAr",
        sub."id"     AS "subjectId",
        sub."nameEn" AS "subjectName",
        sub."nameAr" AS "subjectNameAr",
        e."id"       AS "examId",
        e."maxMark",
        m."obtainedMark",
        CASE WHEN m."id" IS NULL THEN 'Pending' ELSE 'Completed' END AS "markStatus"
      FROM public."Students" s
      JOIN public."Exams" e
        ON e."classId" = s."classId" AND e."term" = $2::"Term"
      JOIN public."Subjects" sub ON sub."id" = e."subjectId"
      LEFT JOIN public."Marks" m
        ON m."examId" = e."id" AND m."studentId" = s."id"
      WHERE s."classId" = $1
      ORDER BY s."nameEn", sub."nameEn"
      `,
      [classId, term],
    );

    return NextResponse.json({ term, students: result.rows });
  } catch (error) {
    return handleError(error, "GET /api/marks/[classId]");
  }
}
