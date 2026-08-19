import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  startVideoUpload,
  completeVideoUpload,
  abortVideoUpload,
  getVideoStatus,
  getSignedPlaybackUrls,
} from "./video.service.js";
import { startUploadSchema, completeUploadSchema } from "./video.validation.js";

export async function startUpload(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const userId = (req as any).user.id;

    const validated = startUploadSchema.parse(req.body);
    const data = await startVideoUpload(lessonId, userId, validated);

    return res.status(200).json({
      message: "Multipart upload started successfully.",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to start upload.",
    });
  }
}

export async function uploadChunk(req: Request, res: Response) {
  try {
    const uploadId = req.query.uploadId as string;
    const partNumber = parseInt(req.params.partNumber as string, 10);

    if (!uploadId) {
      return res.status(400).json({ message: "uploadId is required." });
    }

    const chunksDir = path.join(process.cwd(), "uploads", "chunks", uploadId);
    fs.mkdirSync(chunksDir, { recursive: true });
    const partPath = path.join(chunksDir, `part_${partNumber}`);

    const writeStream = fs.createWriteStream(partPath);

    req.pipe(writeStream);

    writeStream.on("finish", () => {
      const etag = `"local-etag-${partNumber}-${Date.now()}"`;
      res.setHeader("ETag", etag);
      return res.status(200).json({ etag });
    });

    writeStream.on("error", (err) => {
      console.error("Error writing chunk stream:", err);
      return res.status(500).json({ message: "Failed to write chunk file." });
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to save chunk.",
    });
  }
}

export async function completeUpload(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const uploadId = req.params.uploadId as string;
    const userId = (req as any).user.id;

    const validated = completeUploadSchema.parse(req.body);
    const data = await completeVideoUpload(lessonId, userId, uploadId, validated);

    return res.status(200).json({
      message: "Multipart upload completed.",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to complete upload.",
    });
  }
}

export async function abortUpload(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const uploadId = req.params.uploadId as string;
    const userId = (req as any).user.id;

    const result = await abortVideoUpload(lessonId, userId, uploadId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to abort upload.",
    });
  }
}

export async function getStatus(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const data = await getVideoStatus(lessonId);

    return res.status(200).json({
      message: "Video status fetched successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch status.",
    });
  }
}

export async function getPlayback(req: Request, res: Response) {
  try {
    const lessonId = req.params.lessonId as string;
    const userId = (req as any).user.id;

    const data = await getSignedPlaybackUrls(lessonId, userId);

    return res.status(200).json({
      message: "Signed playback URLs generated.",
      data,
    });
  } catch (error) {
    return res.status(403).json({
      message: error instanceof Error ? error.message : "Access denied.",
    });
  }
}
