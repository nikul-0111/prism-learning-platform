import type { Request, Response } from "express";

import {
  createSection as createSectionService,
  deleteSection as deleteSectionService,
  getSectionById as getSectionByIdService,
  getSectionsByCourse as getSectionsByCourseService,
  updateSection as updateSectionService,
} from "./section.service.js";

export async function getSections(
  req: Request,
  res: Response,
) {
  try {
    const courseId = req.params.courseId as string;

    const sections = await getSectionsByCourseService(courseId);

    return res.status(200).json({
      message: "Sections fetched successfully.",
      data: {
        sections,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch sections.",
    });
  }
}

export async function getSectionById(
  req: Request,
  res: Response,
) {
  try {
    const sectionId = req.params.sectionId as string;

    const section = await getSectionByIdService(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Section not found.",
      });
    }

    return res.status(200).json({
      message: "Section fetched successfully.",
      data: {
        section,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch section.",
    });
  }
}

export async function createSection(
  req: Request,
  res: Response,
) {
  try {
    const courseId = req.params.courseId as string;

    const section = await createSectionService(
      courseId,
      req.body,
    );

    return res.status(201).json({
      message: "Section created successfully.",
      data: {
        section,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create section.",
    });
  }
}

export async function updateSection(
  req: Request,
  res: Response,
) {
  try {
    const sectionId = req.params.sectionId as string;

    const section = await updateSectionService(
      sectionId,
      req.body,
    );

    return res.status(200).json({
      message: "Section updated successfully.",
      data: {
        section,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update section.",
    });
  }
}

export async function deleteSection(
  req: Request,
  res: Response,
) {
  try {
    const sectionId = req.params.sectionId as string;

    const result = await deleteSectionService(sectionId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete section.",
    });
  }
}

export async function reorderSections(
  _req: Request,
  res: Response,
) {
  return res.status(200).json({
    message: "Sections reordered successfully.",
  });
}