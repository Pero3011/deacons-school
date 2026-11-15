import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { cleanString, handleError, jsonError, readJson } from "@/lib/api";

export async function GET() {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const params: string[] = [];
    let where = "";

    // Admins only see their own classes; SuperAdmin sees all.
    if (session.role === "Admin") {
      where = `WHERE "adminId" = $1`;
      params.push(session.userId);
    }

    const result = await db.query(
      `SELECT "id", "nameAr", "nameEn", "adminId", "created_at"
       FROM "Classes" ${where} ORDER BY "created_at"`, // note the spaces: fixes $1ORDER
      params,
    );

    return NextResponse.json(result.rows); // an empty list is a valid 200, not a 404
  } catch (error) {
    return handleError(error, "GET /api/classes");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const body = await readJson<Record<string, unknown>>(request);
    const nameAr = cleanString(body?.nameAr, 100);
    const nameEn = cleanString(body?.nameEn, 100);

    if (!nameAr || !nameEn) return jsonError("nameAr and nameEn are required", 400);

    const result = await db.query(
      `INSERT INTO "Classes" ("nameAr", "nameEn", "adminId")
       VALUES ($1, $2, $3)
       RETURNING "id", "nameAr", "nameEn", "adminId", "created_at"`,
      [nameAr, nameEn, session.userId],
    );

    return NextResponse.json(
      { message: "Class created", class: result.rows[0] },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "POST /api/classes");
  }
}
