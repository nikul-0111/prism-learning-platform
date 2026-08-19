import { prisma } from "../src/lib/prisma.js";

async function main() {
  const javaVideoUrl = "https://www.youtube.com/embed/eIrMbAQSU34"; // Popular Java Tutorial
  const webVideoUrl = "https://www.youtube.com/embed/mU6anWqZJcc";  // Popular HTML/CSS/JS Tutorial

  // Update Java free preview lessons
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
              videoUrl: javaVideoUrl,
              content: "📚 INSTRUCTOR LECTURE NOTES & MATERIAL:\n\n1. Java Virtual Machine (JVM) acts as an abstract computing machine that enables Java bytecode to run on any operating system.\n2. Java Development Kit (JDK) includes JRE + Compiler (javac) + Development tools.\n3. Key Data Types: int, double, boolean, String, char, long.\n\nPractice Example:\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello PRISM Student!\");\n    }\n}",
            },
          });
          console.log(`Updated Java lesson '${les.title}' with YouTube embed video URL and lecture notes!`);
        }
      }
    }
  }

  // Update Web Development free preview lessons
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
              videoUrl: webVideoUrl,
              content: "📚 INSTRUCTOR LECTURE NOTES & MATERIAL:\n\n1. HTML5 provides semantic elements: <header>, <nav>, <main>, <section>, <footer>.\n2. CSS3 Flexbox layout enables responsive alignment across mobile & desktop screens.\n3. JavaScript ES6 DOM manipulation: document.querySelector(), addEventListener().\n\nCode Snippet:\nconst btn = document.querySelector('#enroll-btn');\nbtn.addEventListener('click', () => alert('Welcome to PRISM!'));",
            },
          });
          console.log(`Updated Web lesson '${les.title}' with YouTube embed video URL and lecture notes!`);
        }
      }
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
