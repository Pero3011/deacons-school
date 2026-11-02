import { Pool, PoolClient } from "pg";

declare global {
  var postgresPool: Pool | undefined;
}

export function getDbPool(): Pool {
  if (!global.postgresPool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        "PostgreSQL connection string is missing. Please set DATABASE_URL in your .env file.",
      );
    }

    const isLocalhost =
      connectionString.includes("localhost") ||
      connectionString.includes("127.0.0.1");

    const newPool = new Pool({
      connectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
    });

    if (process.env.NODE_ENV !== "production") {
      global.postgresPool = newPool;
    } else {
      return newPool;
    }
  }

  return global.postgresPool!;
}

export async function getDatabaseConnection(): Promise<PoolClient> {
  return getDbPool().connect();
}

export default {
  query: (...args: Parameters<Pool["query"]>) => getDbPool().query(...args),
  connect: () => getDbPool().connect(),
};