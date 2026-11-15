import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { cleanString, handleError, jsonError, readJson } from "@/lib/api";

type RouteContext = { params: Promise<{ classId: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const { classId } = await params;
    const body = await readJson<Record<string, unknown>>(request);

    const hasAr = body?.nameAr !== undefined;
    const hasEn = body?.nameEn !== undefined;
    const nameAr = hasAr ? cleanString(body?.nameAr, 100) : null;
    const nameEn = hasEn ? cleanString(body?.nameEn, 100) : null;

    if ((!hasAr && !hasEn) || (hasAr && !nameAr) || (hasEn && !nameEn)) {
      return jsonError("Provide a valid nameAr and/or nameEn", 400);
    }

    // COALESCE keeps the old value for any field that was not sent.
    const result = await db.query(
      `UPDATE "Classes"
       SET "nameAr" = COALESCE($1, "nameAr"),
           "nameEn" = COALESCE($2, "nameEn")
       WHERE "id" = $3 AND ($4::boolean OR "adminId" = $5)
       RETURNING "id", "nameAr", "nameEn", "adminId", "created_at"`,
      [nameAr, nameEn, classId, session.role === "SuperAdmin", session.userId],
    );

    if (result.rowCount === 0) return jsonError("Class not found", 404);

    return NextResponse.json({ message: "Class updated", class: result.rows[0] });
  } catch (error) {
    return handleError(error, "PUT /api/classes/[classId]");
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { session, error } = await requireSession();
    if (error) return error;

    const { classId } = await params;

    const result = await db.query(
      `DELETE FROM "Classes"
       WHERE "id" = $1 AND ($2::boolean OR "adminId" = $3)
       RETURNING "id"`,
      [classId, session.role === "SuperAdmin", session.userId],
    );

    if (result.rowCount === 0) return jsonError("Class not found", 404);

    return NextResponse.json({ message: "Class deleted" });
  } catch (error) {
    // 23503 (class still has students) becomes a 409 via handleError.
    return handleError(error, "DELETE /api/classes/[classId]");
  }
}
