import { prisma } from "../src/lib/prisma.js";

async function main() {
  // 1. Seed Curriculum for Java
  const javaCourse = await prisma.course.findFirst({
    where: { title: "java" },
  });

  if (javaCourse) {
    // Delete existing empty sections if any
    await prisma.lesson.deleteMany({ where: { section: { courseId: javaCourse.id } } });
    await prisma.section.deleteMany({ where: { courseId: javaCourse.id } });

    // Create Section 1: Java Basics & Setup
    const sec1 = await prisma.section.create({
      data: {
        title: "Section 1: Java Fundamentals & JDK Setup",
        position: 1,
        courseId: javaCourse.id,
      },
    });

    await prisma.lesson.createMany({
      data: [
        {
          title: "Introduction to Java Virtual Machine (JVM) & JRE",
          position: 1,
          type: "VIDEO",
          duration: 600,
          sectionId: sec1.id,
          isFreePreview: true,
        },
        {
          title: "Variables, Data Types, and Operators in Java",
          position: 2,
          type: "VIDEO",
          duration: 900,
          sectionId: sec1.id,
        },
        {
          title: "Java Fundamentals Quiz 1",
          position: 3,
          type: "QUIZ",
          sectionId: sec1.id,
        },
      ],
    });

    // Create Section 2: Object Oriented Programming (OOP)
    const sec2 = await prisma.section.create({
      data: {
        title: "Section 2: Object-Oriented Programming (OOPs)",
        position: 2,
        courseId: javaCourse.id,
      },
    });

    await prisma.lesson.createMany({
      data: [
        {
          title: "Classes, Objects, Constructors, and Methods",
          position: 1,
          type: "VIDEO",
          duration: 1200,
          sectionId: sec2.id,
        },
        {
          title: "Inheritance, Polymorphism, and Encapsulation",
          position: 2,
          type: "VIDEO",
          duration: 1500,
          sectionId: sec2.id,
        },
        {
          title: "Abstract Classes vs Interfaces in Java",
          position: 3,
          type: "VIDEO",
          duration: 1100,
          sectionId: sec2.id,
        },
        {
          title: "OOP Concepts Mastery Quiz",
          position: 4,
          type: "QUIZ",
          sectionId: sec2.id,
        },
      ],
    });

    console.log("Seeded curriculum for Java!");
  }

  // 2. Seed Curriculum for HTML, CSS, JavaScripts
  const webCourse = await prisma.course.findFirst({
    where: { title: "html & css & javascripts" },
  });

  if (webCourse) {
    await prisma.lesson.deleteMany({ where: { section: { courseId: webCourse.id } } });
    await prisma.section.deleteMany({ where: { courseId: webCourse.id } });

    const sec1 = await prisma.section.create({
      data: {
        title: "Section 1: HTML5 & Modern Semantic Web",
        position: 1,
        courseId: webCourse.id,
      },
    });

    await prisma.lesson.createMany({
      data: [
        {
          title: "HTML5 Structure, Tags, Forms, and Elements",
          position: 1,
          type: "VIDEO",
          duration: 800,
          sectionId: sec1.id,
          isFreePreview: true,
        },
        {
          title: "HTML5 Semantic Tags & Accessibility Best Practices",
          position: 2,
          type: "VIDEO",
          duration: 750,
          sectionId: sec1.id,
        },
      ],
    });

    const sec2 = await prisma.section.create({
      data: {
        title: "Section 2: Responsive CSS3 Layouts & Flexbox",
        position: 2,
        courseId: webCourse.id,
      },
    });

    await prisma.lesson.createMany({
      data: [
        {
          title: "CSS Selectors, Box Model, and Flexbox Grid",
          position: 1,
          type: "VIDEO",
          duration: 1100,
          sectionId: sec2.id,
        },
        {
          title: "Media Queries & Responsive Mobile-First Design",
          position: 2,
          type: "VIDEO",
          duration: 950,
          sectionId: sec2.id,
        },
      ],
    });

    const sec3 = await prisma.section.create({
      data: {
        title: "Section 3: JavaScript ES6+ & DOM Manipulation",
        position: 3,
        courseId: webCourse.id,
      },
    });

    await prisma.lesson.createMany({
      data: [
        {
          title: "DOM Manipulation & Event Listeners",
          position: 1,
          type: "VIDEO",
          duration: 1300,
          sectionId: sec3.id,
        },
        {
          title: "Async JavaScript, Promises, and Fetch API",
          position: 2,
          type: "VIDEO",
          duration: 1400,
          sectionId: sec3.id,
        },
        {
          title: "Web Development Mastery Assessment",
          position: 3,
          type: "QUIZ",
          sectionId: sec3.id,
        },
      ],
    });

    console.log("Seeded curriculum for HTML & CSS & JavaScripts!");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
