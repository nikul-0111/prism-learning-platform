import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";

import { getQuiz, saveQuiz, getStudentQuiz, getStudentQuizByLesson } from "./quiz.controller.js";

const router = Router();

/*
 * GET /api/instructor/lessons/:lessonId/quiz
 */
router.get(
  "/lessons/:lessonId/quiz",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  getQuiz,
);

/*
 * POST /api/instructor/lessons/:lessonId/quiz
 */
router.post(
  "/lessons/:lessonId/quiz",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  saveQuiz,
);

/*
 * GET /api/student/lessons/:lessonId/quiz
 * Public/Student route for enrolled students
 */
router.get("/student/lessons/:lessonId/quiz", authMiddleware, getStudentQuizByLesson);

/*
 * GET /api/quizzes/:quizId/student
 * Student route (isCorrect stripped)
 */
router.get("/quizzes/:quizId/student", authMiddleware, getStudentQuiz);

export default router;
