import type { Request, Response } from "express";
import * as adminService from "../services/admin.service.js";

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

export async function approveCourse(req: Request, res: Response): Promise<void> {
  try {
    const courseId = Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!;
    const result = await adminService.approveCourse(courseId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to approve course" });
  }
}

export async function rejectCourse(req: Request, res: Response): Promise<void> {
  try {
    const courseId = Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!;
    const { feedback } = req.body;
    const result = await adminService.rejectCourse(courseId, feedback);
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

export async function getPayoutReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await adminService.getPayoutReport();
    res.status(200).json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch payout report" });
  }
}

export async function getTranscodeQueueStatus(req: Request, res: Response): Promise<void> {
  try {
    const queue = await adminService.getTranscodeQueueStatus();
    res.status(200).json({ success: true, data: queue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch transcode queue" });
  }
}

export async function retryTranscodeJob(req: Request, res: Response): Promise<void> {
  try {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!;
    const result = await adminService.retryTranscodeJob(jobId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to retry job" });
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const role = req.query.role as string | undefined;
    const users = await adminService.getUsersList(role);
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch users" });
  }
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  try {
    const userId = Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!;
    const { role } = req.body;
    if (!role || !["STUDENT", "INSTRUCTOR", "ADMIN"].includes(role.toUpperCase())) {
      res.status(400).json({ success: false, message: "Invalid role specified" });
      return;
    }
    const result = await adminService.updateUserRole(userId, role.toUpperCase() as any);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to update role" });
  }
}
