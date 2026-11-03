import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

interface UserSession {
  userId: string;
  userNameEn: string;
  userNameAr: string;
  userEmail: string;
  role: "Admin" | "SuperAdmin";
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  const storedCookie = await cookies();
  const token = storedCookie.get("token")?.value;

  if (!token) return null;
  const payload = await verifyToken(token);
  return payload as UserSession | null;
}