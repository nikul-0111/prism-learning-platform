import type { Request, Response } from "express";
import {
  createLesson as createLessonService,
  deleteLesson as deleteLessonService,
  getLessonById as getLessonByIdService,
  getLessonsBySection as getLessonsBySectionService,
  updateLesson as updateLessonService,
} from "./lesson.service.js";

export async function getLessons(req: Request, res: Response) {
  try {
    const sectionId = req.params.sectionId as string;
    const lessons = await getLessonsBySectionService(sectionId);

    return res.status(200).json({
      message: "Lessons fetched successfully.",
      data: { lessons },
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch lessons.",
    });
  }
}

export async function getLessonById(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const lesson = await getLessonByIdService(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    return res.status(200).json({
      message: "Lesson fetched successfully.",
      data: { lesson },
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch lesson.",
    });
  }
}

export async function createLesson(req: Request, res: Response) {
  try {
    const sectionId = req.params.sectionId as string;
    const lesson = await createLessonService(sectionId, req.body);

    return res.status(201).json({
      message: "Lesson created successfully.",
      data: { lesson },
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to create lesson.",
    });
  }
}

export async function updateLesson(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const lesson = await updateLessonService(lessonId, req.body);

    return res.status(200).json({
      message: "Lesson updated successfully.",
      data: { lesson },
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to update lesson.",
    });
  }
}

export async function deleteLesson(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const result = await deleteLessonService(lessonId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to delete lesson.",
    });
  }
}
