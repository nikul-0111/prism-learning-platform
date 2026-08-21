import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import * as adminService from "../services/admin.service.js";
import { rejectCourseSchema, updateUserRoleSchema, paginationQuerySchema } from "../validators/admin.validator.js";

export async function getMetrics(req: Request, res: Response): Promise<void> {
  try {
    const metrics = await adminService.getPlatformMetrics();
    res.status(200).json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch metrics" });
  }
}

export async function getPendingCourses(req: Request, res: Response): Promise<void> {
  try {
    const courses = await adminService.getPendingCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch pending courses" });
  }
}

export async function getApprovalHistory(req: Request, res: Response): Promise<void> {
  try {
    const history = await adminService.getApprovalHistory();
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch approval history" });
  }
}

export async function getAllCourses(req: Request, res: Response): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const courses = await adminService.getAllCourses(status, search);
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch courses" });
  }
}

export async function getCourseDetails(req: Request, res: Response): Promise<void> {
  try {
    const courseId = Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!;
    const course = await adminService.getAdminCourseDetails(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    res.status(200).json({ success: true, data: course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch course details" });
  }
}

export async function approveCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const courseId = Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!;
    const reviewerId = req.user?.id;
    const result = await adminService.approveCourse(courseId, reviewerId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to approve course" });
  }
}

export async function rejectCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const courseId = Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!;
    const parseResult = rejectCourseSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors.map((e) => e.message).join(". ");
      res.status(400).json({ success: false, message: errorMessage });
      return;
    }

    const reviewerId = req.user?.id;
    const result = await adminService.rejectCourse(courseId, parseResult.data.reason, reviewerId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to reject course" });
  }
}

export async function getStorageReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await adminService.getStorageReport();
    res.status(200).json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch storage report" });
  }
}

export async function runGarbageCollection(req: Request, res: Response): Promise<void> {
  try {
    const result = await adminService.runGarbageCollection();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to run garbage collection" });
  }
}

export async function getBandwidthReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await adminService.getBandwidthReport();
    res.status(200).json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch bandwidth report" });
  }
}

export async function getPayoutReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await adminService.getPayoutReport();
    res.status(200).json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch payout report" });
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = paginationQuerySchema.safeParse(req.query);
    const { page = 1, limit = 10, search, role } = parseResult.success
      ? parseResult.data
      : { page: 1, limit: 10, search: undefined, role: undefined };

    const result = await adminService.getUsersList(role, page, limit, search);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch users" });
  }
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  try {
    const userId = Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!;
    const parseResult = updateUserRoleSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors.map((e) => e.message).join(". ");
      res.status(400).json({ success: false, message: errorMessage });
      return;
    }

    const result = await adminService.updateUserRole(userId, parseResult.data.role);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to update role" });
  }
}
