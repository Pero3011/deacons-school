import { NextResponse } from "next/server";
import { getDbPool } from "../../../../lib/db";
import { hashPassword } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    const pool = getDbPool();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [
      "admin@deaconschool.com",
    ]);

    if (existing.rowCount === 0) {
      const hashedPassword = await hashPassword("admin123");
      await pool.query(
        `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)`,
        ["admin@deaconschool.com", hashedPassword, "admin"],
      );
    }

    return NextResponse.json({ success: true, message: "Database ready." });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { success: false, message: "Database setup failed." },
      { status: 500 },
    );
  }
}
