import { createToken } from "@/lib/auth";
import { getDatabaseConnection } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let connection;

  try {
    const body = await request.json();
    //Check if the user enters any data
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    connection = await getDatabaseConnection();

    const email = String(body.email).trim().toLowerCase();

    const result = await connection.query(
      `SELECT "id", "role", "nameAr", "nameEn", "email", "password_hash" FROM "Users" WHERE "email" = $1 LIMIT 1`,
      [email],
    );

    //Checks if the user exists
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const user = result.rows[0];

    //Check on the password
    const isPasswordValid = await bcrypt.compare(body?.password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const userId = String(user.id);

    const token = await createToken({
      userId: userId,
      userNameAr: user.nameAr,
      userNameEn: user.nameEn,
      userEmail: user.Email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: userId,
        email: user.email,
        nameAr: user.nameAr,
        nameEn: user.nameEn,
        role: user.role,
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
  } catch (error) {
    console.error("Sign-in failed:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection?.release();
  }
}
