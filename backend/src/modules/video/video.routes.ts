import express, { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import {
  startUpload,
  uploadChunk,
  completeUpload,
  abortUpload,
  getStatus,
  getPlayback,
} from "./video.controller.js";

const router = Router();

/*
 * POST /api/instructor/lessons/:lessonId/video/uploads
 * Start Multipart Upload
 */
router.post(
  "/instructor/lessons/:lessonId/video/uploads",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  startUpload
);

/*
 * PUT /api/instructor/lessons/:lessonId/video/chunks/:partNumber
 * Upload local part chunk
 */
router.put(
  "/instructor/lessons/:lessonId/video/chunks/:partNumber",
  express.raw({ type: "*/*", limit: "50mb" }),
  uploadChunk
);

/*
 * POST /api/instructor/lessons/:lessonId/video/uploads/:uploadId/complete
 * Complete Multipart Upload
 */
router.post(
  "/instructor/lessons/:lessonId/video/uploads/:uploadId/complete",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  completeUpload
);

/*
 * DELETE /api/instructor/lessons/:lessonId/video/uploads/:uploadId
 * Abort Multipart Upload
 */
router.delete(
  "/instructor/lessons/:lessonId/video/uploads/:uploadId",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  abortUpload
);

/*
 * GET /api/instructor/lessons/:lessonId/video/status
 * Get Transcode Status & Progress
 */
router.get(
  "/instructor/lessons/:lessonId/video/status",
  authMiddleware,
  roleMiddleware("INSTRUCTOR"),
  getStatus
);

/*
 * GET /api/videos/:lessonId/playback
 * Get Short-Lived Signed HLS URLs
 */
router.get("/videos/:lessonId/playback", authMiddleware, getPlayback);

export default router;
