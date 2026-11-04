import { getDatabaseConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface StudentInput {
  nameAr: string;
  nameEn: string;
}

interface StudentRow extends StudentInput {
  classId: string;
  created_at: Date;
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  let connection;
  try {
    const body: { students?: StudentInput[] } = await request.json();
    const { students } = body;
    const { id } = await context.params;

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { error: "Please provide a non-empty array of students." },
        { status: 400 },
      );
    }

    const isValid = students.every(
      (s) => typeof s?.nameAr === "string" && typeof s?.nameEn === "string",
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Each student must have valid nameAr and nameEn strings." },
        { status: 400 },
      );
    }
    
    connection = await getDatabaseConnection();

    const values: (string | number)[] = students.flatMap((student) => [
      student.nameAr,
      student.nameEn,
      id,
    ]);

    const valuePlaceholders: string = students
      .map((_, index) => {
        const offset = index * 3;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
      })
      .join(", ");

    const queryText = `
      INSERT INTO "Students" ("nameAr", "nameEn", "classId")
      VALUES ${valuePlaceholders}
      RETURNING *;
    `;

    const result = await connection.query<StudentRow>(queryText, values);

    return NextResponse.json(
      {
        message: `Successfully added ${result.rowCount} students!`,
        students: result.rows,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database insertion error:", error);
    return NextResponse.json(
      { error: "Failed to add students to database." },
      { status: 500 },
    );
  } finally {
    connection?.release();
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  let connection;
  try {
    const { id } = await context.params;
    connection = await getDatabaseConnection();

    const query = `SELECT * FROM "Students" WHERE "classId" = $1`;
    const result = await connection.query(query, [id]);

    const students = result.rows;
    if (students.length === 0)
      return NextResponse.json(
        { message: "No students in this class yet!" },
        { status: 404 },
      );
    
    return NextResponse.json(students);
  } catch (error) {
    console.error("Failed to GET students", error);
    return NextResponse.json(
      { message: "Failed to GET students" },
      { status: 500 },
    );
  } finally {
    connection?.release();
  }
}
