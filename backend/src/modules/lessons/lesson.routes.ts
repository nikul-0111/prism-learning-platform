import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";

import {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} from "./lesson.controller.js";

const router = Router();

/*
 * GET /api/instructor/sections/:sectionId/lessons
 */
router.get(
  "/sections/:sectionId/lessons",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  getLessons,
);

/*
 * POST /api/instructor/sections/:sectionId/lessons
 */
router.post(
  "/sections/:sectionId/lessons",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  createLesson,
);

/*
 * GET /api/instructor/lessons/:lessonId
 */
router.get(
  "/lessons/:lessonId",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  getLessonById,
);

/*
 * PATCH /api/instructor/lessons/:lessonId
 */
router.patch(
  "/lessons/:lessonId",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  updateLesson,
);

/*
 * DELETE /api/instructor/lessons/:lessonId
 */
router.delete(
  "/lessons/:lessonId",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  deleteLesson,
);

export default router;
