import { prisma } from "../src/lib/prisma.js";

async function main() {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: { select: { name: true, email: true, role: true } },
      course: { select: { title: true, price: true } },
    },
  });

  console.log("=== ALL CURRENT ENROLLMENTS ===");
  console.table(
    enrollments.map((e) => ({
      id: e.id,
      user: `${e.user.name} (${e.user.role})`,
      userEmail: e.user.email,
      course: e.course.title,
    }))
  );
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
