import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { asId, handleError, jsonError, readJson } from "@/lib/api";
import { isAttendanceStatus, isTerm } from "@/lib/constants";

type RouteContext = { params: Promise<{ classId: string }> };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// GET: class + its students + attendance grouped by term
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const { classId } = await params;

    const result = await db.query(
      `
      SELECT
        c."id" AS "classId",
        c."nameAr" AS "classNameAr",
        c."nameEn" AS "classNameEn",
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', s."id",
              'nameAr', s."nameAr",
              'nameEn', s."nameEn",
              'attendances',
              COALESCE(
                (
                  SELECT jsonb_object_agg(abt."term", abt."records")
                  FROM (
                    SELECT
                      a."term"::text AS "term",
                      jsonb_agg(
                        jsonb_build_object(
                          'id', a."id",
                          'attendanceDate', a."attendanceDate",
                          'status', a."status",
                          'term', a."term",
                          'updated_at', a."updated_at"
                        )
                        ORDER BY a."attendanceDate" DESC
                      ) AS "records"
                    FROM "Attendances" a
                    WHERE a."studentId" = s."id"
                    GROUP BY a."term"
                  ) abt
                ),
                '{}'::jsonb
              )
            )
          ) FILTER (WHERE s."id" IS NOT NULL),
          '[]'::jsonb
        ) AS "students"
      FROM "Classes" c
      LEFT JOIN "Students" s ON s."classId" = c."id"
      WHERE c."id" = $1 AND ($2::boolean OR c."adminId" = $3)
      GROUP BY c."id"
      `,
      [classId, session.role === "SuperAdmin", session.userId],
    );

    if (result.rows.length === 0) return jsonError("Class not found", 404);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return handleError(error, "GET /api/attendances/[classId]");
  }
}

// POST: insert or update one student's attendance for one day
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const { classId } = await params;
    const body = await readJson<Record<string, unknown>>(request);

    const studentId = asId(body?.studentId);
    const { attendanceDate, status, term } = body ?? {};

    if (!studentId) return jsonError("studentId is required", 400);
    if (!isValidDate(attendanceDate)) {
      return jsonError("attendanceDate must be a real date in YYYY-MM-DD format", 400);
    }
    if (!isAttendanceStatus(status)) return jsonError("Invalid status", 400);
    if (!isTerm(term)) return jsonError("Invalid term", 400);

    const result = await db.query(
      `
      INSERT INTO "Attendances" ("studentId", "attendanceDate", "status", "term")
      SELECT s."id", $3::date, $4::"AttendanceStatus", $5::"Term"
      FROM "Students" s
      JOIN "Classes" c ON c."id" = s."classId"
      WHERE s."id" = $1
        AND s."classId" = $2
        AND ($6::boolean OR c."adminId" = $7)
      ON CONFLICT ("studentId", "attendanceDate")
      DO UPDATE SET
        "status" = EXCLUDED."status",
        "term" = EXCLUDED."term",
        "updated_at" = CURRENT_TIMESTAMP
      RETURNING *
      `,
      [
        studentId,
        classId,
        attendanceDate,
        status,
        term,
        session.role === "SuperAdmin",
        session.userId,
      ],
    );

    if (result.rows.length === 0) {
      return jsonError("Student not found in this class", 404);
    }

    return NextResponse.json({
      message: "Attendance saved",
      attendance: result.rows[0],
    });
  } catch (error) {
    return handleError(error, "POST /api/attendances/[classId]");
  }
}

// PUT: mark a whole class in one request
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const { classId } = await params;
    const body = await readJson<Record<string, unknown>>(request);
    const { attendanceDate, term, records } = body ?? {};

    if (!isValidDate(attendanceDate)) return jsonError("Invalid attendanceDate", 400);
    if (!isTerm(term)) return jsonError("Invalid term", 400);
    if (!Array.isArray(records) || records.length === 0 || records.length > 200) {
      return jsonError("records must be an array of 1 to 200 items", 400);
    }

    const ids: string[] = [];
    const statuses: string[] = [];
    for (const r of records) {
      const id = asId((r as Record<string, unknown>)?.studentId);
      const st = (r as Record<string, unknown>)?.status;
      if (!id || !isAttendanceStatus(st)) {
        return jsonError("Each record needs a valid studentId and status", 400);
      }
      ids.push(id);
      statuses.push(st);
    }

    const result = await db.query(
      `
      INSERT INTO "Attendances" ("studentId", "attendanceDate", "status", "term")
      SELECT s."id", $3::date, r.status::"AttendanceStatus", $4::"Term"
      FROM unnest($5::text[], $6::text[]) AS r(student_id, status)
      JOIN "Students" s ON s."id"::text = r.student_id AND s."classId" = $1
      JOIN "Classes" c ON c."id" = s."classId"
      WHERE ($2::boolean OR c."adminId" = $7)
      ON CONFLICT ("studentId", "attendanceDate")
      DO UPDATE SET "status" = EXCLUDED."status", "term" = EXCLUDED."term",
                    "updated_at" = CURRENT_TIMESTAMP
      RETURNING "studentId"
      `,
      [classId, session.role === "SuperAdmin", attendanceDate, term, ids, statuses, session.userId],
    );

    // Students that were not in this class are silently skipped; tell the caller.
    return NextResponse.json({
      message: "Attendance saved",
      saved: result.rowCount,
      skipped: ids.length - (result.rowCount ?? 0),
    });
  } catch (error) {
    return handleError(error, "PUT /api/attendances/[classId]");
  }
}
