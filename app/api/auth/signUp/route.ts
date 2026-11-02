import { NextResponse } from "next/server";
import { getDatabaseConnection } from "@/lib/db";
import bcrypt from "bcrypt";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  let connection;
  try {
    connection = await getDatabaseConnection();
    const body = await request.json();

    if (!body.nameAr || !body.nameEn || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    //Preprocessing on the data
    const nameAr = String(body.nameAr).trim();
    const nameEn = String(body.nameEn).trim();
    const emailNormalized = String(body.email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailNormalized)) {
      return NextResponse.json(
        { error: "Invalid Email Format" },
        { status: 400 },
      );
    }

    const passwordHashed = await bcrypt.hash(body.password, 10);
    const role = "Admin";

    // Single query inserts and returns the created user
    const insertResult = await connection.query(
      `INSERT INTO "Users" ("nameAr", "nameEn", "email", "password_hash", "role")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING "id", "nameAr", "email", "nameEn", "role"`,
      [nameAr, nameEn, emailNormalized, passwordHashed, role],
    );

    const newUserRow = insertResult.rows[0];
    const userId = String(newUserRow.user_id);

    const token = await createToken({
      userId: userId,
      userNameAr: newUserRow.nameAr,
      userNameEn: newUserRow.nameEn,
      userEmail: newUserRow.email,
      role: newUserRow.role,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: userId,
        email: newUserRow.email,
        nameAr: newUserRow.nameAr,
        nameEn: newUserRow.nameEn,
        role: newUserRow.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
