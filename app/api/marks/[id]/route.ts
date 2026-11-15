import { getDatabaseConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Term = "Term1" | "Term2" | "Term3";

const ALLOWED_TERMS = ["Term1", "Term2", "Term3"];

type RouteContext = {
  params: Promise<{ id: string }>;
};

// Search for the exam in Exams and adds new obtainedMark to specific studId 
export async function POST(request: NextRequest, context: RouteContext) {
  let connection;
  let transactionStarted = false;

  try {
    // 1. Get classId from route and term from query
    const { id: classId } = await context.params;

    const term = request.nextUrl.searchParams.get("term");

    // 2. Get data from request body
    const body = await request.json();

    const { studentId, subjectId, obtainedMark } = body;

    // 3. Validate input
    if (!classId || !studentId || !subjectId) {
      return NextResponse.json(
        { message: "Missing required IDs" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TERMS.includes(term ?? "")) {
      return NextResponse.json({ message: "Invalid term" }, { status: 400 });
    }

    if (typeof obtainedMark !== "number" || !Number.isFinite(obtainedMark)) {
      return NextResponse.json(
        { message: "Obtained mark must be a valid number" },
        { status: 400 },
      );
    }

    // 4. Connect to database
    connection = await getDatabaseConnection();

    await connection.query("BEGIN");
    transactionStarted = true;

    // 5. Check if student belongs to this class
    const studentResult = await connection.query(
      `
      SELECT id
      FROM public."Students"
      WHERE id = $1
        AND "classId" = $2
      `,
      [studentId, classId],
    );

    if (studentResult.rows.length === 0) {
      await connection.query("ROLLBACK");
      transactionStarted = false;

      return NextResponse.json(
        { message: "Student not found in this class" },
        { status: 404 },
      );
    }

    // 6. Find the exam for this class, subject, and term
    const examResult = await connection.query(
      `
      SELECT id, "maxMark"
      FROM public."Exams"
      WHERE "classId" = $1
        AND "subjectId" = $2
        AND term = $3::"Term"
      `,
      [classId, subjectId, term],
    );

    if (examResult.rows.length === 0) {
      await connection.query("ROLLBACK");
      transactionStarted = false;

      return NextResponse.json(
        { message: "Exam not found for this class, subject, and term" },
        { status: 404 },
      );
    }

    const exam = examResult.rows[0];
    const examId = exam.id;
    const maxMark = Number(exam.maxMark);

    // 7. Validate obtained mark
    if (obtainedMark < 0 || obtainedMark > maxMark) {
      await connection.query("ROLLBACK");
      transactionStarted = false;

      return NextResponse.json(
        {
          message: `Mark must be between 0 and ${maxMark}`,
          maxMark,
        },
        { status: 400 },
      );
    }

    // 8. Insert or update the student's mark
    const markResult = await connection.query(
      `
      INSERT INTO public."Marks"
        ("studentId", "examId", "obtainedMark")
      VALUES ($1, $2, $3)

      ON CONFLICT ("studentId", "examId")
      DO UPDATE SET
        "obtainedMark" = EXCLUDED."obtainedMark",
        updated_at = CURRENT_TIMESTAMP

      RETURNING *
      `,
      [studentId, examId, obtainedMark],
    );

    // 9. Commit transaction
    await connection.query("COMMIT");
    transactionStarted = false;

    return NextResponse.json(
      {
        message: "Mark saved successfully",
        mark: markResult.rows[0],
      },
      { status: 200 },
    );
  } catch (error) {
    if (connection && transactionStarted) {
      try {
        await connection.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }

    console.error("POST Mark Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// GET Marks per current Term
export async function GET(request: NextRequest, context: RouteContext) {
  let connection;

  try {
    // Get class ID from route params
    const { id } = await context.params;

    // Get term from URL search params
    const term = request.nextUrl.searchParams.get("term");

    // Validate term
    const allowedTerms: Term[] = ["Term1", "Term2", "Term3"];

    if (!term || !allowedTerms.includes(term as Term)) {
      return NextResponse.json(
        { error: "Invalid or missing term" },
        { status: 400 },
      );
    }

    connection = await getDatabaseConnection();

    const query = `
      SELECT
        s.id AS "studentId",
        s."nameEn",
        s."nameAr",

        sub.id AS "subjectId",
        sub."nameEn" AS "subjectName",
        sub."nameAr" AS "subjectNameAr",

        e.id AS "examId",
        e."maxMark",

        m."obtainedMark",

        CASE
          WHEN m.id IS NULL THEN 'Pending'
          ELSE 'Completed'
        END AS "markStatus"

      FROM public."Students" s

      CROSS JOIN public."Subjects" sub

      LEFT JOIN public."Exams" e
        ON e."classId" = s."classId"
        AND e."subjectId" = sub.id
        AND e.term = $2::"Term"

      LEFT JOIN public."Marks" m
        ON m."examId" = e.id
        AND m."studentId" = s.id

      WHERE s."classId" = $1

      ORDER BY s."nameEn", sub."nameEn";
    `;

    const result = await connection.query(query, [id, term]);

    return NextResponse.json({
      success: true,
      term,
      students: result.rows,
    });
  } catch (error) {
    console.error("GET Marks Error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve marks" },
      { status: 400 },
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
