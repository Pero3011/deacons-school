import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: any) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return NextResponse.json({ error: "No Token" }, { status: 401 });

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is undefined!");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      role: string;
    };

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    requestHeaders.set("x-user-role", decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token!" }, { status: 401 });
  }
}
export const config = {
  matcher: ["/api/((?!auth/login).*)"],
};