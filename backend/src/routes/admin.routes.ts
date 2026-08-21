import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminGuard } from "../middleware/admin.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

// Protect all admin endpoints with authMiddleware and adminGuard
router.use(authMiddleware as any);
router.use(adminGuard as any);

// Metrics & Overview
router.get("/metrics", adminController.getMetrics as any);

// Course Approvals Queue, History & Management
router.get("/courses", adminController.getAllCourses as any);
router.get("/courses/pending", adminController.getPendingCourses as any);
router.get("/courses/history", adminController.getApprovalHistory as any);
router.get("/courses/:id", adminController.getCourseDetails as any);
router.post("/courses/:id/approve", adminController.approveCourse as any);
router.post("/courses/:id/reject", adminController.rejectCourse as any);

// Storage & Bandwidth Management
router.get("/storage", adminController.getStorageReport as any);
router.post("/storage/gc", adminController.runGarbageCollection as any);
router.get("/usage", adminController.getBandwidthReport as any);

// Instructor Payout Reports
router.get("/payouts", adminController.getPayoutReport as any);

// User Governance & Role Updates
router.get("/users", adminController.getUsers as any);
router.patch("/users/:id/role", adminController.updateUserRole as any);

export default router;
