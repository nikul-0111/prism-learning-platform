import { prisma } from "../src/lib/prisma.js";

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });

  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      price: true,
      instructor: { select: { name: true, email: true } },
      _count: { select: { sections: true, enrollments: true } },
    },
  });

  console.log("=== CURRENT USERS ===");
  console.table(users);

  console.log("\n=== CURRENT COURSES ===");
  console.table(
    courses.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      price: c.price,
      instructor: c.instructor.name,
      sections: c._count.sections,
      enrollments: c._count.enrollments,
    }))
  );
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
