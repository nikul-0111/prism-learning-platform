import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import {
  enrollStudentInCourse,
  getStudentEnrollments,
  getInstructorStudents,
} from "./enrollment.service.js";

export async function enrollInCourse(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const courseId = req.params.courseId as string;
    const result = await enrollStudentInCourse(req.user.id, courseId);

    return res.status(200).json({
      message: result.message,
      data: result.enrollment,
      isNew: result.isNew,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Enrollment failed.",
    });
  }
}

export async function getMyEnrollments(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const enrollments = await getStudentEnrollments(req.user.id);

    return res.status(200).json({
      message: "Enrollments fetched successfully.",
      data: enrollments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch enrollments.",
    });
  }
}

export async function getInstructorStudentsList(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const students = await getInstructorStudents(req.user.id);

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch instructor students.",
    });
  }
}

