import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:7990835922@localhost:5432/prism_db_final?schema=public";

async function main() {
  const pool = new pg.Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log("Creating public.enrollments table via direct SQL...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE,
        CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON DELETE CASCADE,
        CONSTRAINT "enrollments_userId_courseId_key" UNIQUE ("userId", "courseId")
      );

      CREATE INDEX IF NOT EXISTS "enrollments_userId_idx" ON public.enrollments("userId");
      CREATE INDEX IF NOT EXISTS "enrollments_courseId_idx" ON public.enrollments("courseId");
    `);

    console.log("SUCCESS: Table public.enrollments has been created successfully!");
  } catch (err) {
    console.error("SQL Error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
