import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  enrollInCourse,
  getMyEnrollments,
  getInstructorStudentsList,
} from "./enrollment.controller.js";

const router = Router();

// Student Enrollments
router.post("/courses/:courseId/enroll", authMiddleware, enrollInCourse);
router.get("/enrollments", authMiddleware, getMyEnrollments);
router.get("/enrollments/instructor-students", authMiddleware, getInstructorStudentsList);

export default router;

