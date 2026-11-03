import { getDatabaseConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  let connection;
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!body.nameAr && !body.nameEn) {
      return NextResponse.json({
        message: "No Update occurred!",
      });
    }
    connection = await getDatabaseConnection();

    await connection.query(
      `UPDATE "Classes"
        SET "nameAr" = $1, "nameEn" = $2
        WHERE "id"=$3;
        `,
      [body.nameAr, body.nameEn, id],
    );

    return NextResponse.json({
      message: "Update Successfully!",
      updated: {
        classId: id,
        nameAr: body.nameAr,
        nameEn: body.nameEn,
      },
    });
  } catch (error) {
    console.error("Update failed:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection?.release();
  }
}
export async function DELETE(request: NextRequest, context: RouteContext) {
  let connection;
  try {
    const { id } = await context.params;

    console.log(id);
    connection = await getDatabaseConnection();
    await connection.query(
      `DELETE FROM "Classes" 
        WHERE "id"=$1`,
      [id],
    );
    return NextResponse.json({
      message: "Class Deleted Successfully!",
    });
  } catch (error) {
    console.error("Delete failed:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection?.release();
  }
}
