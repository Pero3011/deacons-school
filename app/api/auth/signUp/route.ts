import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { createToken, getSession, setSessionCookie, type Role } from "@/lib/auth";
import { cleanString, handleError, jsonError, readJson } from "@/lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    if (!body) return jsonError("Invalid JSON body", 400);

    const nameAr = cleanString(body.nameAr, 100);
    const nameEn = cleanString(body.nameEn, 100);
    const email = cleanString(body.email, 254)?.toLowerCase() ?? null;
    const password = typeof body.password === "string" ? body.password : "";

    if (!nameAr || !nameEn || !email || !password) {
      return jsonError("Missing required fields", 400);
    }
    if (!EMAIL_RE.test(email)) return jsonError("Invalid email format", 400);
    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return jsonError("Password must be at least 8 characters (72 bytes max)", 400);
    }

    // Never trust a client-supplied role.
    const caller = await getSession();
    const role: Role = body.role === "SuperAdmin" ? "SuperAdmin" : "Admin";
    if (role === "SuperAdmin" && caller?.role !== "SuperAdmin") {
      return jsonError("Forbidden", 403);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO "Users" ("nameAr", "nameEn", "email", "password_hash", "role")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING "id", "nameAr", "nameEn", "email", "role"`,
      [nameAr, nameEn, email, passwordHash, role],
    );

    const user = result.rows[0];
    const userId = String(user.id); // was user_id (undefined)

    const response = NextResponse.json(
      {
        message: "Account created",
        user: {
          id: userId,
          email: user.email,
          nameAr: user.nameAr,
          nameEn: user.nameEn,
          role: user.role,
        },
      },
      { status: 201 },
    );

    // Public self-signup logs the new user in. A SuperAdmin creating an account for someone else must not.
    if (caller?.role !== "SuperAdmin") {
      const token = await createToken({
        userId,
        userNameAr: user.nameAr,
        userNameEn: user.nameEn,
        userEmail: user.email,
        role: user.role,
      });
      setSessionCookie(response, token);
    }

    return response;
  } catch (error) {
    return handleError(error, "POST /api/auth/signUp");
  }
}
