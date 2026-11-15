import { getDatabaseConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ classId: string }>;
};

type AttendanceInput = {
  studentId: string;
  attendanceDate: string;
  status: string;
  term: string;
};

// GET: Retrieves a class with its students and attendance grouped by term.
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { classId } = await params;
  let connection;

  try {
    connection = await getDatabaseConnection();

    const queryText = `
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
                  SELECT jsonb_object_agg(
                    attendance_by_term."term",
                    attendance_by_term."records"
                  )
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
                        ORDER BY a."updated_at" DESC
                      ) AS "records"
                    FROM "Attendances" a
                    WHERE a."studentId" = s."id"
                    GROUP BY a."term"
                  ) attendance_by_term
                ),
                '{}'::jsonb
              )
            )
          ) FILTER (WHERE s."id" IS NOT NULL),
          '[]'::jsonb
        ) AS "students"

      FROM "Classes" c

      LEFT JOIN "Students" s
        ON s."classId" = c."id"

      WHERE c."id" = $1

      GROUP BY c."id";
    `;

    const result = await connection.query(queryText, [classId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error retrieving class attendances:", error);

    return NextResponse.json(
      { message: "Failed to retrieve attendances" },
      { status: 500 },
    );
  } finally {
    connection?.release();
  }
}

// POST: Inserts or updates a student's attendance.
export async function POST(request: NextRequest, { params }: RouteContext) {
  const { classId } = await params;
  let connection;
  try {
    const body: AttendanceInput = await request.json();

    const { studentId, attendanceDate, status, term } = body;

    // Validate required fields
    if (!studentId || !attendanceDate || !status || !term) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate attendance date
    const parsedDate = new Date(attendanceDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid attendance date" },
        { status: 400 },
      );
    }

    connection = await getDatabaseConnection();

    const queryText = `
      INSERT INTO "Attendances" (
        "studentId",
        "attendanceDate",
        "status",
        "term"
      )

      SELECT
        s."id",
        $3::timestamp,
        $4::"AttendanceStatus",
        $5::"Term"

      FROM "Students" s

      WHERE s."id" = $1
        AND s."classId" = $2

      ON CONFLICT ("studentId", "attendanceDate")

      DO UPDATE SET
        "status" = EXCLUDED."status",
        "term" = EXCLUDED."term",
        "updated_at" = CURRENT_TIMESTAMP

      RETURNING *;
    `;

    const result = await connection.query(queryText, [
      studentId,
      classId,
      parsedDate.toISOString(),
      status,
      term,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Student not found in this class" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Attendance saved successfully",
        attendance: result.rows[0],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving attendance:", error);

    return NextResponse.json(
      { message: "Failed to save attendance" },
      { status: 500 },
    );
  } finally {
    connection?.release();
  }
}
