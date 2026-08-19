import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminGuard } from "../middleware/admin.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

// Protect all admin endpoints with authMiddleware and adminGuard
router.use(authMiddleware as any);
router.use(adminGuard as any);

// Metrics & Overview
router.get("/metrics", adminController.getMetrics);

// Course Approvals Queue
router.get("/courses/pending", adminController.getPendingCourses);
router.post("/courses/:id/approve", adminController.approveCourse);
router.post("/courses/:id/reject", adminController.rejectCourse);

// Storage & Bandwidth
router.get("/storage", adminController.getStorageReport);
router.post("/storage/gc", adminController.runGarbageCollection);

// Instructor Payouts
router.get("/payouts", adminController.getPayoutReport);

// Transcode Queue Monitor
router.get("/transcode-queue", adminController.getTranscodeQueueStatus);
router.post("/transcode-queue/:id/retry", adminController.retryTranscodeJob);

// User Governance
router.get("/users", adminController.getUsers);
router.patch("/users/:id/role", adminController.updateUserRole);

export default router;
