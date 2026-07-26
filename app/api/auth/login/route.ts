import { handlePrismaError } from "@/lib/handleError";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: any) {
  try {
    const body = await request.json();
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user)
      return Response.json({ error: "Invalid Entries!" }, { status: 401 });

    const isPasswordValid = await bcrypt.compare(
      body.password,
      user.password_hash,
    );

    if (!isPasswordValid)
        return Response.json({ error: "Invalid Entries!" }, { status: 401 });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is undefined!");
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return Response.json({ token });
  } catch (error) {
    console.error(error);
    return handlePrismaError(error);
  }
}
