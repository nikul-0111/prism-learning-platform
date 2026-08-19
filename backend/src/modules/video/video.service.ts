import fs from "fs/promises";
import path from "path";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import {
  createMultipartUpload,
  generatePresignedPartUrls,
  completeMultipartUpload as completeS3MultipartUpload,
  abortMultipartUpload as abortS3MultipartUpload,
} from "../../services/storage/s3.service.js";
import { getShortLivedSignedUrl } from "../../services/storage/presigned-url.service.js";
import { enqueueTranscodeJob } from "../../queues/transcode.queue.js";
import { StartUploadInput, CompleteUploadInput } from "./video.validation.js";

export async function startVideoUpload(
  lessonId: string,
  userId: string,
  input: StartUploadInput
) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      section: {
        include: {
          course: true,
        },
      },
      asset: true,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  if (lesson.section.course.instructorId !== userId) {
    throw new Error("Unauthorized: You do not own this course.");
  }

  if (lesson.type !== "VIDEO") {
    throw new Error("Lesson is not of type VIDEO.");
  }

  if (input.fileSize > env.VIDEO_MAX_SIZE_BYTES) {
    throw new Error(`File size exceeds maximum allowed limit of ${env.VIDEO_MAX_SIZE_BYTES} bytes.`);
  }

  // Delete existing uncompleted asset if present
  if (lesson.asset) {
    if (lesson.asset.uploadId) {
      await abortS3MultipartUpload(lesson.asset.objectKey, lesson.asset.uploadId).catch(() => {});
    }
    await prisma.asset.delete({ where: { id: lesson.asset.id } });
  }

  const s3ObjectKey = `courses/${lesson.section.courseId}/lessons/${lessonId}/source/${Date.now()}-${input.fileName}`;

  // Start Multipart Upload (S3 or local fallback)
  const { uploadId, objectKey, isS3 } = await createMultipartUpload(lessonId, s3ObjectKey, input.contentType);

  const partSize = env.VIDEO_PART_SIZE_BYTES;
  const totalParts = Math.ceil(input.fileSize / partSize);

  // Generate presigned part URLs
  const parts = await generatePresignedPartUrls(lessonId, objectKey, uploadId, totalParts, isS3);

  // Save Asset Record in DB
  const asset = await prisma.asset.create({
    data: {
      lessonId,
      uploadId,
      objectKey,
      originalFileName: input.fileName,
      fileSize: BigInt(input.fileSize),
      declaredContentType: input.contentType,
      status: "UPLOADING",
    },
  });

  return {
    assetId: asset.id,
    uploadId,
    objectKey,
    partSize,
    totalParts,
    parts,
  };
}

export async function saveLocalChunk(
  uploadId: string,
  partNumber: number,
  buffer: Buffer
) {
  const chunksDir = path.join(process.cwd(), "uploads", "chunks", uploadId);
  await fs.mkdir(chunksDir, { recursive: true });
  const partPath = path.join(chunksDir, `part_${partNumber}`);
  await fs.writeFile(partPath, buffer);
  return { etag: `"local-etag-${partNumber}"` };
}

export async function completeVideoUpload(
  lessonId: string,
  userId: string,
  uploadId: string,
  input: CompleteUploadInput
) {
  const asset = await prisma.asset.findUnique({
    where: { id: input.assetId },
    include: {
      lesson: {
        include: {
          section: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (!asset || asset.lessonId !== lessonId) {
    throw new Error("Asset not found for this lesson.");
  }

  if (asset.lesson.section.course.instructorId !== userId) {
    throw new Error("Unauthorized: You do not own this course.");
  }

  if (asset.status !== "UPLOADING") {
    return {
      message: "Upload already completed.",
      assetId: asset.id,
      status: asset.status,
    };
  }

  // Complete Multipart Upload
  await completeS3MultipartUpload(asset.objectKey, uploadId, input.parts);

  // Update Asset status -> QUEUED
  const updatedAsset = await prisma.asset.update({
    where: { id: asset.id },
    data: {
      status: "QUEUED",
      transcodeProgress: 0,
    },
  });

  // Automatically trigger transcoding pipeline simulation
  simulateLocalTranscode(asset.id, lessonId, asset.objectKey).catch(() => {});

  return {
    message: "Upload completed. Transcoding job active.",
    assetId: updatedAsset.id,
    status: updatedAsset.status,
  };
}

async function simulateLocalTranscode(assetId: string, lessonId: string, objectKey: string) {
  try {
    await prisma.asset.update({
      where: { id: assetId },
      data: { status: "PROBING", transcodeProgress: 15 },
    });
    await new Promise((r) => setTimeout(r, 1000));

    await prisma.asset.update({
      where: { id: assetId },
      data: { status: "TRANSCODING", transcodeProgress: 45 },
    });
    await new Promise((r) => setTimeout(r, 1500));

    await prisma.asset.update({
      where: { id: assetId },
      data: { transcodeProgress: 80 },
    });
    await new Promise((r) => setTimeout(r, 1000));

    await prisma.asset.update({
      where: { id: assetId },
      data: {
        status: "READY",
        transcodeProgress: 100,
        masterPlaylistKey: objectKey,
        thumbnailKey: objectKey,
      },
    });

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        duration: 15,
        videoUrl: objectKey,
      },
    });
  } catch (err) {
    console.error("Local transcode simulation error:", err);
  }
}

export async function abortVideoUpload(
  lessonId: string,
  userId: string,
  uploadId: string
) {
  const asset = await prisma.asset.findFirst({
    where: { lessonId, uploadId },
    include: {
      lesson: {
        include: {
          section: {
            include: { course: true },
          },
        },
      },
    },
  });

  if (!asset) {
    throw new Error("Asset not found.");
  }

  if (asset.lesson.section.course.instructorId !== userId) {
    throw new Error("Unauthorized.");
  }

  await abortS3MultipartUpload(asset.objectKey, uploadId).catch(() => {});
  await prisma.asset.delete({ where: { id: asset.id } });

  return { message: "Multipart upload aborted successfully." };
}

export async function getVideoStatus(lessonId: string) {
  try {
    const asset = await prisma.asset.findUnique({
      where: { lessonId },
    });

    if (!asset) {
      return {
        status: "NOT_STARTED",
        progress: 0,
        message: "No video uploaded yet.",
      };
    }

    return {
      assetId: asset.id,
      status: asset.status,
      progress: asset.transcodeProgress,
      duration: asset.duration,
      errorMessage: asset.errorMessage,
    };
  } catch (error) {
    console.error("Error in getVideoStatus:", error);
    return {
      status: "NOT_STARTED",
      progress: 0,
      message: "No video asset found.",
    };
  }
}

export async function getSignedPlaybackUrls(lessonId: string, userId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      asset: true,
      section: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  if ((!lesson.asset || lesson.asset.status !== "READY" || !lesson.asset.masterPlaylistKey) && !lesson.videoUrl) {
    throw new Error("Video is not ready for streaming.");
  }

  const masterPlaylistUrl = (lesson.asset && lesson.asset.masterPlaylistKey)
    ? await getShortLivedSignedUrl(lesson.asset.masterPlaylistKey, 900)
    : lesson.videoUrl || "";

  const thumbnailUrl = lesson.asset?.thumbnailKey
    ? await getShortLivedSignedUrl(lesson.asset.thumbnailKey, 900)
    : null;
  const spriteSheetUrl = lesson.asset?.spriteSheetKey
    ? await getShortLivedSignedUrl(lesson.asset.spriteSheetKey, 900)
    : null;

  return {
    lessonId,
    title: lesson.title,
    masterPlaylistUrl,
    thumbnailUrl,
    spriteSheetUrl,
    expiresInSeconds: 900,
  };
}
