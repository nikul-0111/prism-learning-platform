import { prisma } from "../../lib/prisma.js";
import {
  validateCreateLesson,
  validateUpdateLesson,
} from "./lesson.validation.js";
import type {
  CreateLessonInput,
  UpdateLessonInput,
} from "./lesson.types.js";

export async function getLessonsBySection(sectionId: string) {
  return prisma.lesson.findMany({
    where: {
      sectionId,
    },
    orderBy: {
      position: "asc",
    },
  });
}

export async function getLessonById(lessonId: string) {
  return prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
  });
}

export async function createLesson(
  sectionId: string,
  data: CreateLessonInput,
) {
  const input = validateCreateLesson(data);

  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
    },
  });

  if (!section) {
    throw new Error("Section not found.");
  }

  const lastLesson = await prisma.lesson.findFirst({
    where: {
      sectionId,
    },
    orderBy: {
      position: "desc",
    },
  });

  const position = lastLesson ? lastLesson.position + 1 : 0;

  return prisma.lesson.create({
    data: {
      sectionId,
      title: input.title,
      description: input.description,
      type: input.type as any,
      videoUrl: input.videoUrl,
      content: input.content,
      duration: input.duration,
      isFreePreview: input.isFreePreview,
      position,
    },
  });
}

export async function updateLesson(
  lessonId: string,
  data: UpdateLessonInput,
) {
  const input = validateUpdateLesson(data);

  const existingLesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!existingLesson) {
    throw new Error("Lesson not found.");
  }

  return prisma.lesson.update({
    where: {
      id: lessonId,
    },
    data: input as any,
  });
}

export async function deleteLesson(lessonId: string) {
  const existingLesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!existingLesson) {
    throw new Error("Lesson not found.");
  }

  await prisma.lesson.delete({
    where: {
      id: lessonId,
    },
  });

  return {
    message: "Lesson deleted successfully.",
  };
}
