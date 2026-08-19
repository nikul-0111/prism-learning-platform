import { prisma } from "../src/lib/prisma.js";

async function main() {
  await prisma.course.updateMany({
    where: {
      title: {
        in: ["java", "html & css & javascripts"],
      },
    },
    data: {
      thumbnail: null,
    },
  });

  console.log("Successfully reset thumbnails for 'java' and 'html & css & javascripts' to their original state (null).");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
