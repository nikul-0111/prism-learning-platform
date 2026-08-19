import { prisma } from "../src/lib/prisma.js";

async function main() {
  const courses = await prisma.course.findMany({
    include: {
      sections: {
        include: {
          lessons: true,
        },
      },
      instructor: true,
    },
  });

  console.log("Course Details Inspection:");
  courses.forEach((c) => {
    console.log(`Course: ${c.title} (ID: ${c.id})`);
    console.log(`Instructor: ${c.instructor?.name}`);
    console.log(`Sections count: ${c.sections.length}`);
    c.sections.forEach((s, idx) => {
      console.log(`  Section ${idx + 1}: ${s.title} (${s.lessons.length} lessons)`);
      s.lessons.forEach((l) => console.log(`    Lesson: ${l.title} (${l.type})`));
    });
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
