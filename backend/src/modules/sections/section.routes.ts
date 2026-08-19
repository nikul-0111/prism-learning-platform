import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";

import {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection,
  reorderSections,
} from "./section.controller.js";

const router = Router();

/*
 * GET /api/instructor/courses/:courseId/sections
 * Instructor only
 */
router.get(
  "/courses/:courseId/sections",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  getSections,
);

/*
 * POST /api/instructor/courses/:courseId/sections
 * Instructor only
 */
router.post(
  "/courses/:courseId/sections",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  createSection,
);

/*
 * GET /api/instructor/sections/:sectionId
 * Instructor only
 */
router.get(
  "/sections/:sectionId",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  getSectionById,
);

/*
 * PATCH /api/instructor/sections/:sectionId
 * Instructor only
 */
router.patch(
  "/sections/:sectionId",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  updateSection,
);

/*
 * DELETE /api/instructor/sections/:sectionId
 * Instructor only
 */
router.delete(
  "/sections/:sectionId",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  deleteSection,
);

/*
 * PATCH /api/instructor/courses/:courseId/sections/reorder
 * Instructor only
 */
router.patch(
  "/courses/:courseId/sections/reorder",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  reorderSections,
);

export default router;
