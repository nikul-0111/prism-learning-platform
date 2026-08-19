import { Worker, Job } from "bullmq";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { redisConnectionOptions } from "../config/redis.js";
import { s3Client } from "../config/s3.js";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { TRANSCODE_QUEUE_NAME, TranscodeJobData } from "../queues/transcode.queue.js";
import { probeMediaFile } from "../services/media/ffprobe.service.js";
import { transcodeToHLS } from "../services/media/ffmpeg.service.js";

console.log("🚀 Starting PRISM Video Transcoding Worker Process...");

export const transcodeWorker = new Worker<TranscodeJobData>(
  TRANSCODE_QUEUE_NAME,
  async (job: Job<TranscodeJobData>) => {
    const { assetId, lessonId, objectKey } = job.data;
    console.log(`[Worker] Processing Job ${job.id} for Asset: ${assetId}`);

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `prism-transcode-${assetId}-`));
    const inputFilePath = path.join(tempDir, "input_original.mp4");
    const outputDir = path.join(tempDir, "output");

    try {
      // 1. Update Asset Status -> PROBING
      await prisma.asset.update({
        where: { id: assetId },
        data: { status: "PROBING", transcodeProgress: 5 },
      });

      // 2. Download source file from S3 to temp inputFilePath
      console.log(`[Worker] Downloading source from S3 key: ${objectKey}`);
      const downloadCommand = new GetObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: objectKey,
      });
      const s3Response = await s3Client.send(downloadCommand);

      if (!s3Response.Body) {
        throw new Error("S3 source object body is empty.");
      }

      const fileStream = s3Response.Body as any;
      const chunks: Buffer[] = [];
      for await (const chunk of fileStream) {
        chunks.push(Buffer.from(chunk));
      }
      await fs.writeFile(inputFilePath, Buffer.concat(chunks));

      // 3. Probing Untrusted Media Magic Bytes
      console.log(`[Worker] Probing media file bytes...`);
      const probeResult = await probeMediaFile(inputFilePath);

      if (!probeResult.isValid) {
        throw new Error(probeResult.errorMessage || "Untrusted or invalid video file rejected.");
      }

      await prisma.asset.update({
        where: { id: assetId },
        data: {
          status: "TRANSCODING",
          actualContentType: probeResult.formatName,
          duration: probeResult.duration,
          width: probeResult.width,
          height: probeResult.height,
          transcodeProgress: 10,
        },
      });

      // 4. Run FFmpeg HLS Transcoding Ladder & Sprite Generation
      console.log(`[Worker] Starting HLS Transcode Ladder (360p, 720p, 1080p)...`);
      const outputs = await transcodeToHLS({
        inputPath: inputFilePath,
        outputDir,
        onProgress: async (percent, msg) => {
          console.log(`[Worker Progress ${assetId}] ${percent}% - ${msg}`);
          await prisma.asset.update({
            where: { id: assetId },
            data: { transcodeProgress: percent },
          }).catch(() => {});
        },
      });

      // 5. Upload Generated HLS Output Artifacts Back to S3
      console.log(`[Worker] Uploading HLS outputs back to S3 storage...`);
      const baseS3Prefix = `courses/lessons/${lessonId}/processed`;

      // Upload HLS directory recursively
      await uploadDirectoryToS3(outputs.hlsDir, `${baseS3Prefix}/hls`);

      // Upload Thumbnail & Sprite Sheet
      const thumbnailS3Key = `${baseS3Prefix}/thumbnails/thumbnail.jpg`;
      const spriteS3Key = `${baseS3Prefix}/sprites/sprite.jpg`;
      const masterPlaylistS3Key = `${baseS3Prefix}/hls/master.m3u8`;

      const thumbnailBuf = await fs.readFile(outputs.thumbnailPath);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: thumbnailS3Key,
          Body: thumbnailBuf,
          ContentType: "image/jpeg",
        })
      );

      const spriteBuf = await fs.readFile(outputs.spriteSheetPath);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: spriteS3Key,
          Body: spriteBuf,
          ContentType: "image/jpeg",
        })
      );

      // 6. Update Asset Status -> READY & Update Lesson Duration
      await prisma.asset.update({
        where: { id: assetId },
        data: {
          status: "READY",
          transcodeProgress: 100,
          masterPlaylistKey: masterPlaylistS3Key,
          thumbnailKey: thumbnailS3Key,
          spriteSheetKey: spriteS3Key,
          errorMessage: null,
        },
      });

      if (probeResult.duration) {
        const durationMinutes = Math.ceil(probeResult.duration / 60);
        await prisma.lesson.update({
          where: { id: lessonId },
          data: {
            duration: durationMinutes,
            videoUrl: masterPlaylistS3Key,
          },
        });
      }

      console.log(`[Worker SUCCESS] Asset ${assetId} is now READY!`);
    } catch (err) {
      const errorMsg = (err as Error).message || "Transcode job failed.";
      console.error(`[Worker ERROR] Asset ${assetId} Transcode Failed:`, errorMsg);

      await prisma.asset.update({
        where: { id: assetId },
        data: {
          status: "FAILED",
          errorMessage: errorMsg,
        },
      }).catch(() => {});

      throw err;
    } finally {
      // Clean up temporary scratch directory
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  },
  {
    connection: redisConnectionOptions,
    concurrency: 2,
  }
);

async function uploadDirectoryToS3(localDir: string, s3Prefix: string) {
  const entries = await fs.readdir(localDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(localDir, entry.name);
    const s3Key = `${s3Prefix}/${entry.name}`;

    if (entry.isDirectory()) {
      await uploadDirectoryToS3(fullPath, s3Key);
    } else {
      const fileBuf = await fs.readFile(fullPath);
      const contentType = entry.name.endsWith(".m3u8")
        ? "application/x-mpegURL"
        : entry.name.endsWith(".ts")
        ? "video/MP2T"
        : "application/octet-stream";

      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: s3Key,
          Body: fileBuf,
          ContentType: contentType,
        })
      );
    }
  }
}
