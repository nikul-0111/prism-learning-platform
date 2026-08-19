import { prisma } from "../src/lib/prisma.js";

async function main() {
  const sampleVideo1 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  const sampleVideo2 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Update free preview lessons for Java
  const javaCourse = await prisma.course.findFirst({
    where: { title: "java" },
    include: { sections: { include: { lessons: true } } },
  });

  if (javaCourse) {
    for (const sec of javaCourse.sections) {
      for (const les of sec.lessons) {
        if (les.isFreePreview || les.position === 1) {
          await prisma.lesson.update({
            where: { id: les.id },
            data: {
              isFreePreview: true,
              videoUrl: sampleVideo1,
              content: "Welcome to this free preview lesson on Java Fundamentals! In this lecture, we cover JVM architecture, JDK installation, and fundamental data types in Java.",
            },
          });
          console.log(`Updated Java lesson '${les.title}' with sample video URL!`);
        }
      }
    }
  }

  // Update free preview lessons for HTML & CSS & JavaScripts
  const webCourse = await prisma.course.findFirst({
    where: { title: "html & css & javascripts" },
    include: { sections: { include: { lessons: true } } },
  });

  if (webCourse) {
    for (const sec of webCourse.sections) {
      for (const les of sec.lessons) {
        if (les.isFreePreview || les.position === 1) {
          await prisma.lesson.update({
            where: { id: les.id },
            data: {
              isFreePreview: true,
              videoUrl: sampleVideo2,
              content: "Welcome to HTML, CSS & JavaScripts Free Preview! Learn how HTML elements, CSS selectors, and JS DOM manipulation work together to create modern responsive web apps.",
            },
          });
          console.log(`Updated Web lesson '${les.title}' with sample video URL!`);
        }
      }
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
