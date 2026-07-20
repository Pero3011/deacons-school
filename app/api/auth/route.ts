import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "../../../lib/db";
import { comparePassword, signJwt } from "../../../lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 },
      );
    }

    const pool = getDbPool();
    const result = await pool.query(
      `SELECT id, email, password_hash, role FROM users WHERE email = $1 LIMIT 1`,
      [email.toLowerCase()],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 },
      );
    }

    const user = result.rows[0];
    const isValidPassword = await comparePassword(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 },
      );
    }

    const token = signJwt({ sub: user.id, role: user.role });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed." },
      { status: 500 },
    );
  }
}
