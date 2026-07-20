import { Pool } from "pg";

let pool: Pool | null = null;

export function getDbPool() {
  if (!pool) {
    const connectionString =
      process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        "PostgreSQL connection string is not configured. Set POSTGRES_URL or DATABASE_URL.",
      );
    }

    pool = new Pool({
      connectionString,
      ssl:
        connectionString.includes("localhost") ||
        connectionString.includes("127.0.0.1")
          ? false
          : { rejectUnauthorized: false },
    });
  }

  return pool;
}
