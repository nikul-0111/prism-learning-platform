import type { Request, Response } from "express";
import {
  createOrUpdateQuiz as createOrUpdateQuizService,
  getQuizByLesson as getQuizByLessonService,
  getQuizForStudent as getQuizForStudentService,
} from "./quiz.service.js";

export async function getQuiz(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const quiz = await getQuizByLessonService(lessonId);

    return res.status(200).json({
      message: "Quiz fetched successfully.",
      data: { quiz },
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch quiz.",
    });
  }
}

export async function saveQuiz(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const quiz = await createOrUpdateQuizService(lessonId, req.body);

    return res.status(200).json({
      message: "Quiz saved successfully.",
      data: { quiz },
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to save quiz.",
    });
  }
}

export async function getStudentQuiz(req: Request, res: Response) {
  try {
    const quizId = req.params.quizId as string;
    const quiz = await getQuizForStudentService(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    return res.status(200).json({
      message: "Student quiz payload fetched securely.",
      data: { quiz },
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch student quiz.",
    });
  }
}

export async function getStudentQuizByLesson(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const quiz = await getQuizByLessonService(lessonId);

    return res.status(200).json({
      message: "Student quiz fetched successfully.",
      data: { quiz },
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch quiz.",
    });
  }
}
