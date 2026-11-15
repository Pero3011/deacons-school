import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export type Role = "Admin" | "SuperAdmin";

export interface UserSession {
  userId: string;
  userNameEn: string;
  userNameAr: string;
  userEmail: string;
  role: Role;
}

export const SESSION_COOKIE = "token";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds. Used for BOTH token and cookie.

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET_KEY must be set and at least 32 characters long.");
  }
  return new TextEncoder().encode(secret);
}

export async function createToken(session: UserSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  const secret = getSecret(); // outside try: a missing secret should fail loudly
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    const { userId, userNameEn, userNameAr, userEmail, role } = payload as Record<
      string,
      unknown
    >;

    if (typeof userId !== "string" || (role !== "Admin" && role !== "SuperAdmin")) {
      return null;
    }

    return {
      userId,
      userNameEn: String(userNameEn ?? ""),
      userNameAr: String(userNameAr ?? ""),
      userEmail: String(userEmail ?? ""),
      role,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/**
 * Usage in a route:
 *   const { session, error } = await requireSession();
 *   if (error) return error;
 */
export async function requireSession(roles?: Role[]) {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    } as const;
  }

  if (roles && !roles.includes(session.role)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    } as const;
  }

  return { session, error: null } as const;
}

/** SuperAdmin can access any class. An Admin can access only classes where adminId = their id. */
export async function canAccessClass(
  session: UserSession,
  classId: string,
): Promise<boolean> {
  const result = await db.query(
    `SELECT 1 FROM "Classes" WHERE "id" = $1 AND ($2::boolean OR "adminId" = $3)`,
    [classId, session.role === "SuperAdmin", session.userId],
  );
  return (result.rowCount ?? 0) > 0;
}
