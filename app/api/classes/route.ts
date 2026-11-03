import { getSession } from "@/lib/auth";
import { getDatabaseConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  let connection;
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const currentUser = session.userId;
    const currentUserRole = session.role;

    connection = await getDatabaseConnection();

    let query = `SELECT "id", "nameAr", "nameEn", "adminId", "created_at" FROM "Classes"`;
    let queryParams = [];

    // Filter by adminId if the current user is an Admin
    if (currentUserRole === "Admin") {
      query += ` WHERE "adminId" = $1`;
      queryParams.push(currentUser);
    }

    const result = await connection.query(query+`ORDER BY "created_at"`, queryParams);
    const classes = result.rows;

    if (classes.length === 0) {
      return NextResponse.json(
        { error: "No class available!" },
        { status: 404 },
      );
    }

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Class fetching failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection?.release();
  }
}

export async function POST(request:NextRequest) {
    let connection;
    try {
        const session = await getSession();

        if (!session)
          return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

        const currentUser = session.userId;

        const body = await request.json();
        if (!body.nameAr || !body.nameEn) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 },
          );
        }

        //Insert in the Classes table
        connection = await getDatabaseConnection()
        const query = `INSERT INTO "Classes" ("nameAr", "nameEn", "adminId") VALUES ($1, $2, $3)`;

      await connection.query(query, [body.nameAr, body.nameEn, currentUser])
      
      const response = NextResponse.json({
        message: "New Class added successfully",
        user: {
          adminId: currentUser,
          nameAr: body.nameAr,
          nameEn: body.nameEn,
        },
      });

      return response;
    } catch (error) {
        console.error("Class Insertion failed:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 },
        );
    } finally {
        connection?.release();
    }
}