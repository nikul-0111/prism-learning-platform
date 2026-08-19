import { prisma } from "../src/lib/prisma.js";

async function main() {
  const deleted = await prisma.enrollment.deleteMany({});
  console.log(`Deleted ${deleted.count} enrollment records.`);

  const courses = await prisma.course.findMany({
    select: { id: true, title: true, status: true, price: true },
  });

  const enrollments = await prisma.enrollment.findMany({});

  console.log("\n=== ALL COURSES (AVAILABLE IN CATALOGUE) ===");
  console.table(courses);

  console.log("\n=== STUDENT ENROLLMENTS ===");
  console.log(`Total Enrollments: ${enrollments.length}`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
