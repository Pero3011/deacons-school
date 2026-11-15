import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** Returns null instead of throwing when the body is missing or not valid JSON. */
export async function readJson<T = unknown>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

/** Trimmed non-empty string within maxLength, otherwise null. */
export function cleanString(value: unknown, maxLength = 200): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
}

/** Accepts a non-empty string or an integer and returns it as a string id. */
export function asId(value: unknown): string | null {
  if (typeof value === "number" && Number.isInteger(value)) return String(value);
  if (typeof value === "string" && value.trim().length > 0 && value.length <= 64) {
    return value.trim();
  }
  return null;
}

/** Turn a caught error into the right HTTP response. */
export function handleError(error: unknown, context: string) {
  const code = (error as { code?: string } | null)?.code;

  switch (code) {
    case "22P02": // invalid text representation (e.g. bad uuid / enum)
    case "22007": // invalid datetime format
    case "22008": // datetime field overflow
      return jsonError("Invalid input", 400);
    case "23503": // foreign key violation
      return jsonError("This record is still referenced by other records", 409);
    case "23505": // unique violation
      return jsonError("A record with these values already exists", 409);
  }

  console.error(`${context} failed:`, error);
  return jsonError("Internal Server Error", 500);
}
