import { prisma } from "../src/lib/prisma.js";

async function main() {
  const keepTitles = ["java", "html & css & javascripts"];

  // Find courses to delete
  const coursesToDelete = await prisma.course.findMany({
    where: {
      title: {
        notIn: keepTitles,
      },
    },
    select: { id: true, title: true },
  });

  console.log("Courses selected for deletion:", coursesToDelete);

  const deleteIds = coursesToDelete.map((c) => c.id);

  if (deleteIds.length > 0) {
    const res = await prisma.course.deleteMany({
      where: {
        id: { in: deleteIds },
      },
    });
    console.log(`Successfully deleted ${res.count} courses!`);
  } else {
    console.log("No courses matched deletion criteria.");
  }

  // Verify remaining courses & users
  const remainingCourses = await prisma.course.findMany({
    select: { id: true, title: true, status: true, price: true },
  });

  const remainingUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });

  console.log("\n=== REMAINING USERS ===");
  console.table(remainingUsers);

  console.log("\n=== REMAINING COURSES ===");
  console.table(remainingCourses);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
