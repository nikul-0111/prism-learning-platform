import { prisma } from "../src/lib/prisma.js";

async function main() {
  const htmlCssJsUrl = "https://www.10bestdesign.com/blog/content/images/2018/03/20.png";
  const javaUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgIPg7erQO8ISlB45My7zxEtJPeMjOL1WEjDol-bucMLrCwK1ByfHrLSgkaApqvimQo4qbLlpDMeti4u3oDpySirBEYgmTQbcYCjRAweXi9MXEXAbbn0_KUuyKFkD3CCcf8J9C3is9ZYZekURNbA5AvvHsWkfQAenhHJQ5rbPQ2qKP2P_PkXllRDRiTGw/s1973/java.PNG";

  // Update HTML, CSS, JavaScripts course
  const webCourse = await prisma.course.findFirst({
    where: {
      title: {
        contains: "html",
        mode: "insensitive",
      },
    },
  });

  if (webCourse) {
    await prisma.course.update({
      where: { id: webCourse.id },
      data: { thumbnail: htmlCssJsUrl },
    });
    console.log(`Updated course '${webCourse.title}' thumbnail to: ${htmlCssJsUrl}`);
  }

  // Update Java course
  const javaCourse = await prisma.course.findFirst({
    where: {
      title: {
        equals: "java",
        mode: "insensitive",
      },
    },
  });

  if (javaCourse) {
    await prisma.course.update({
      where: { id: javaCourse.id },
      data: { thumbnail: javaUrl },
    });
    console.log(`Updated course '${javaCourse.title}' thumbnail to: ${javaUrl}`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
