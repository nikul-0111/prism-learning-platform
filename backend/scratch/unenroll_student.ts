import { prisma } from "../src/lib/prisma.js";

async function main() {
  const student = await prisma.user.findFirst({
    where: { email: "parmarnikul11104@gmail.com" },
  });

  if (!student) {
    console.error("Student not found!");
    return;
  }

  const result = await prisma.enrollment.deleteMany({
    where: {
      userId: student.id,
    },
  });

  console.log(`Un-enrolled student ${student.name} (${student.email}) from ${result.count} courses.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
