import { prisma } from "../../lib/prisma.js";
import {
  validateCreateSection,
  validateUpdateSection,
} from "./section.validation.js";
import type {
  CreateSectionInput,
  UpdateSectionInput,
} from "./section.types.js";

export async function getSectionsByCourse(courseId: string) {
  return prisma.section.findMany({
    where: {
      courseId,
    },
    orderBy: {
      position: "asc",
    },
  });
}

export async function getSectionById(sectionId: string) {
  return prisma.section.findUnique({
    where: {
      id: sectionId,
    },
  });
}

export async function createSection(
  courseId: string,
  data: CreateSectionInput,
) {
  const input = validateCreateSection(data);

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  const lastSection = await prisma.section.findFirst({
    where: {
      courseId,
    },
    orderBy: {
      position: "desc",
    },
  });

  const position = lastSection
    ? lastSection.position + 1
    : 0;

  return prisma.section.create({
    data: {
      courseId,
      title: input.title,
      description: input.description,
      position,
    },
  });
}

export async function updateSection(
  sectionId: string,
  data: UpdateSectionInput,
) {
  const input = validateUpdateSection(data);

  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
    },
  });

  if (!section) {
    throw new Error("Section not found.");
  }

  return prisma.section.update({
    where: {
      id: sectionId,
    },
    data: {
      ...(input.title !== undefined
        ? { title: input.title }
        : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
    },
  });
}

export async function deleteSection(sectionId: string) {
  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
    },
  });

  if (!section) {
    throw new Error("Section not found.");
  }

  await prisma.section.delete({
    where: {
      id: sectionId,
    },
  });

  return {
    message: "Section deleted successfully.",
  };
}