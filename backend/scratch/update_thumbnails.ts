import { prisma } from "../src/lib/prisma.js";

async function main() {
  const javaCourse = await prisma.course.findFirst({
    where: { title: "java" },
  });

  if (javaCourse) {
    await prisma.course.update({
      where: { id: javaCourse.id },
      data: {
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      },
    });
    console.log("Updated thumbnail for 'java' course!");
  }

  const webCourse = await prisma.course.findFirst({
    where: { title: "html & css & javascripts" },
  });

  if (webCourse) {
    await prisma.course.update({
      where: { id: webCourse.id },
      data: {
        thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
      },
    });
    console.log("Updated thumbnail for 'html & css & javascripts' course!");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
