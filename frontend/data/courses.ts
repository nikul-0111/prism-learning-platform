export interface Course {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  lessons: number;
  rating: number;
  image: string;
}

export const courses: Course[] = [
  {
    slug: "full-stack-web-development",
    title: "Full Stack Web Development",
    description:
      "Learn how to build modern full-stack web applications from frontend to backend.",
    category: "Development",
    level: "Beginner",
    lessons: 24,
    rating: 4.8,
    image: "/images/courses/full-stack.jpg",
  },
  {
    slug: "react-development",
    title: "React Development",
    description:
      "Build modern interactive web applications using React and TypeScript.",
    category: "Development",
    level: "Intermediate",
    lessons: 18,
    rating: 4.9,
    image: "/images/courses/react.jpg",
  },
  {
    slug: "typescript-fundamentals",
    title: "TypeScript Fundamentals",
    description:
      "Understand TypeScript fundamentals and use types to build reliable applications.",
    category: "Development",
    level: "Beginner",
    lessons: 15,
    rating: 4.7,
    image: "/images/courses/typescript.jpg",
  },
];