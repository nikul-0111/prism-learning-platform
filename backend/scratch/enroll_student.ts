import { prisma } from "../src/lib/prisma.js";

async function main() {
  const student = await prisma.user.findFirst({
    where: { email: "parmarnikul11104@gmail.com" },
  });

  if (!student) {
    console.error("Student not found!");
    return;
  }

  const courses = await prisma.course.findMany({
    where: {
      title: {
        in: ["java", "html & css & javascripts"],
      },
    },
  });

  for (const course of courses) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course.id,
      },
    });
    console.log(`Enrolled student ${student.name} (${student.email}) into course "${course.title}".`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
