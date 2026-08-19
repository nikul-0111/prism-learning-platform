import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:7990835922@localhost:5432/prism_db_final?schema=public";

async function main() {
  const pool = new pg.Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log("Clearing all test records from public.enrollments table...");
    await client.query(`TRUNCATE TABLE public.enrollments RESTART IDENTITY CASCADE;`);
    console.log("SUCCESS: All course enrollments have been removed. My Courses is now 100% empty!");
  } catch (err) {
    console.error("Clear Enrollments Error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
