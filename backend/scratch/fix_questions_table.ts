import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:7990835922@localhost:5432/prism_db_final?schema=public";

async function main() {
  const pool = new pg.Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log("Adding missing columns (points, position) to public.questions table...");
    await client.query(`
      ALTER TABLE public.questions 
      ADD COLUMN IF NOT EXISTS "points" INTEGER NOT NULL DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "position" INTEGER NOT NULL DEFAULT 0;
    `);

    console.log("SUCCESS: Columns points and position added to public.questions successfully!");
  } catch (err) {
    console.error("SQL Alter Error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
