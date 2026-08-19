import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";

import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "./course.controller.js";

const router = Router();

/*
 * GET /api/courses
 * Public / All Users (Catalogue)
 */
router.get(
  "/",
  getAllCourses,
);

/*
 * GET /api/courses/:courseId
 * Public / All Users (Course Detail)
 */
router.get(
  "/:courseId",
  getCourseById,
);

/*
 * POST /api/courses
 * Instructor only
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  createCourse,
);

/*
 * PATCH /api/courses/:courseId
 * Instructor only
 */
router.patch(
  "/:courseId",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  updateCourse,
);

/*
 * DELETE /api/courses/:courseId
 * Instructor only
 */
router.delete(
  "/:courseId",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  deleteCourse,
);

export default router;