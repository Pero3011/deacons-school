import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

const globalForPg = globalThis as unknown as { postgresPool?: Pool };

export function getDbPool(): Pool {
  if (!globalForPg.postgresPool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is missing. Set it in your environment.");
    }

    const isLocal =
      connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

    globalForPg.postgresPool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: true },
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }

  return globalForPg.postgresPool;
}

export async function getDatabaseConnection(): Promise<PoolClient> {
  return getDbPool().connect();
}

const db = {
  query: <R extends QueryResultRow = QueryResultRow>(
    queryText: string,
    values?: unknown[],
  ): Promise<QueryResult<R>> => getDbPool().query<R>(queryText, values),
  connect: (): Promise<PoolClient> => getDbPool().connect(),
};

export default db;
