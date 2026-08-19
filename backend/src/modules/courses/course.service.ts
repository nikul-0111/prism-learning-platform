import { prisma } from "../../lib/prisma.js";

import {
  validateCreateCourse,
  validateUpdateCourse,
} from "./course.validation.js";

export async function createCourse(
  instructorId: string,
  data: unknown,
) {
  const input = validateCreateCourse(data);

  const course = await prisma.course.create({
    data: {
      title: input.title,
      shortDescription: input.shortDescription,
      description: input.description,
      category: input.category,
      level: input.level as any,
      price: input.price,
      thumbnail: input.thumbnail,
      status: input.status as any,
      instructorId,
    },
  });

  return course;
}

export interface GetAllCoursesFilter {
  status?: string;
  instructorId?: string;
  includeDrafts?: boolean;
}

export async function getAllCourses(filter?: GetAllCoursesFilter) {
  const whereClause: any = {};

  if (filter?.instructorId) {
    whereClause.instructorId = filter.instructorId;
    if (filter?.status) {
      whereClause.status = filter.status.toUpperCase();
    }
  } else if (filter?.includeDrafts) {
    if (filter?.status) {
      whereClause.status = filter.status.toUpperCase();
    }
  } else {
    // PUBLIC CATALOGUE: Only return PUBLISHED courses to students
    whereClause.status = "PUBLISHED";
  }

  const courses = await prisma.course.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return courses;
}

export async function getCourseById(
  courseId: string,
) {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      sections: {
        orderBy: {
          position: "asc",
        },
        include: {
          lessons: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
}

export async function updateCourse(
  courseId: string,
  instructorId: string,
  data: unknown,
) {
  const input = validateUpdateCourse(data);

  const existingCourse = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!existingCourse) {
    throw new Error("Course not found");
  }

  if (existingCourse.instructorId !== instructorId) {
    throw new Error(
      "You can only update your own courses",
    );
  }

  const course = await prisma.course.update({
    where: {
      id: courseId,
    },
    data: input,
  });

  return course;
}

export async function deleteCourse(
  courseId: string,
  instructorId: string,
) {
  const existingCourse = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!existingCourse) {
    throw new Error("Course not found");
  }

  if (existingCourse.instructorId !== instructorId) {
    throw new Error(
      "You can only delete your own courses",
    );
  }

  await prisma.course.delete({
    where: {
      id: courseId,
    },
  });

  return {
    message: "Course deleted successfully",
  };
}