import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { createToken, setSessionCookie } from "@/lib/auth";
import { cleanString, handleError, jsonError, readJson } from "@/lib/api";

// Compared against when the email is unknown, so timing is the same either way.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export async function POST(request: NextRequest) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const email = cleanString(body?.email, 254)?.toLowerCase();
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return jsonError("Email and password are required", 400);
    }

    const result = await db.query(
      `SELECT "id", "role", "nameAr", "nameEn", "email", "password_hash"
       FROM "Users" WHERE "email" = $1 LIMIT 1`,
      [email],
    );

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

    if (!user || !valid) return jsonError("Invalid email or password", 401);

    const userId = String(user.id);

    const token = await createToken({
      userId,
      userNameAr: user.nameAr,
      userNameEn: user.nameEn,
      userEmail: user.email, // was user.Email (undefined)
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

    setSessionCookie(response, token);
    return response;
  } catch (error) {
    return handleError(error, "POST /api/auth/signIn");
  }
}
