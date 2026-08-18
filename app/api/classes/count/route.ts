import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const count = await prisma.classes.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to count classes" },
      { status: 500 },
    );
  }
}
