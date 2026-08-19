import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

import {
  createCourse as createCourseService,
  getAllCourses as getAllCoursesService,
  getCourseById as getCourseByIdService,
  updateCourse as updateCourseService,
  deleteCourse as deleteCourseService,
} from "./course.service.js";

export async function createCourse(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const course = await createCourseService(
      req.user.id,
      req.body,
    );

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create course",
    });
  }
}

export async function getAllCourses(
  req: Request,
  res: Response,
) {
  try {
    const includeDrafts = req.query.includeDrafts === "true";
    const status = typeof req.query.status === "string" ? req.query.status : undefined;

    const courses = await getAllCoursesService({
      includeDrafts,
      status,
    });

    return res.status(200).json({
      message: "Courses fetched successfully.",
      data: courses,
      courses,
    });
  } catch {
    return res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
}

export async function getCourseById(
  req: Request,
  res: Response,
) {
  try {
    const courseId = req.params.courseId;

    if (typeof courseId !== "string") {
      return res.status(400).json({
        message: "Course ID is required",
      });
    }

    const course = await getCourseByIdService(courseId);

    return res.status(200).json({
      message: "Course details fetched successfully.",
      data: course,
      course,
    });
  } catch (error) {
    return res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "Course not found",
    });
  }
}

export async function updateCourse(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const courseId = req.params.courseId;

    if (typeof courseId !== "string") {
      return res.status(400).json({
        message: "Course ID is required",
      });
    }

    const course = await updateCourseService(
      courseId,
      req.user.id,
      req.body,
    );

    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update course",
    });
  }
}

export async function deleteCourse(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const courseId = req.params.courseId;

    if (typeof courseId !== "string") {
      return res.status(400).json({
        message: "Course ID is required",
      });
    }

    const result = await deleteCourseService(
      courseId,
      req.user.id,
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete course",
    });
  }
}