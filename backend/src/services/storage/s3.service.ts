import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  CompletedPart,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import path from "path";
import crypto from "crypto";
import { s3Client } from "../../config/s3.js";
import { env } from "../../config/env.js";

export interface PresignedPartUrl {
  partNumber: number;
  url: string;
}

export async function createMultipartUpload(lessonId: string, objectKey: string, contentType: string) {
  try {
    const command = new CreateMultipartUploadCommand({
      Bucket: env.S3_BUCKET,
      Key: objectKey,
      ContentType: contentType,
    });

    const response = await s3Client.send(command);
    return {
      uploadId: response.UploadId!,
      objectKey,
      isS3: true,
    };
  } catch {
    // Fallback to local disk storage if MinIO / S3 is not available
    const uploadId = `local-${crypto.randomUUID()}`;
    const chunksDir = path.join(process.cwd(), "uploads", "chunks", uploadId);
    await fs.mkdir(chunksDir, { recursive: true });

    return {
      uploadId,
      objectKey: `uploads/source/${uploadId}.mp4`,
      isS3: false,
    };
  }
}

export async function generatePresignedPartUrls(
  lessonId: string,
  objectKey: string,
  uploadId: string,
  totalParts: number,
  isS3: boolean = true
): Promise<PresignedPartUrl[]> {
  const parts: PresignedPartUrl[] = [];

  if (isS3) {
    try {
      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const command = new UploadPartCommand({
          Bucket: env.S3_BUCKET,
          Key: objectKey,
          UploadId: uploadId,
          PartNumber: partNumber,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        parts.push({ partNumber, url });
      }
      return parts;
    } catch {
      // Fallback
    }
  }

  // Local fallback endpoints
  const baseUrl = `http://localhost:${env.PORT}/api/instructor/lessons/${lessonId}/video/chunks`;
  for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
    parts.push({
      partNumber,
      url: `${baseUrl}/${partNumber}?uploadId=${uploadId}`,
    });
  }

  return parts;
}

export async function completeMultipartUpload(
  objectKey: string,
  uploadId: string,
  parts: { partNumber: number; etag: string }[]
) {
  if (!uploadId.startsWith("local-")) {
    try {
      const sortedParts: CompletedPart[] = parts
        .sort((a, b) => a.partNumber - b.partNumber)
        .map((p) => ({
          PartNumber: p.partNumber,
          ETag: p.etag,
        }));

      const command = new CompleteMultipartUploadCommand({
        Bucket: env.S3_BUCKET,
        Key: objectKey,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: sortedParts,
        },
      });

      return await s3Client.send(command);
    } catch {
      // Local fallback
    }
  }

  // Combine local chunk files into final source video file on disk
  const chunksDir = path.join(process.cwd(), "uploads", "chunks", uploadId);
  const sourceDir = path.join(process.cwd(), "uploads", "source");
  await fs.mkdir(sourceDir, { recursive: true });

  const finalPath = path.join(process.cwd(), objectKey);
  const sortedParts = [...parts].sort((a, b) => a.partNumber - b.partNumber);

  // Clear/create target file
  await fs.writeFile(finalPath, Buffer.alloc(0));

  for (const part of sortedParts) {
    const chunkPath = path.join(chunksDir, `part_${part.partNumber}`);
    try {
      const chunkBuf = await fs.readFile(chunkPath);
      await fs.appendFile(finalPath, chunkBuf);
    } catch (err) {
      console.error(`Failed to append chunk part_${part.partNumber}:`, err);
    }
  }

  // Clean up temporary chunks directory
  await fs.rm(chunksDir, { recursive: true, force: true }).catch(() => {});
  return { Key: objectKey };
}

export async function abortMultipartUpload(objectKey: string, uploadId: string) {
  if (!uploadId.startsWith("local-")) {
    try {
      const command = new AbortMultipartUploadCommand({
        Bucket: env.S3_BUCKET,
        Key: objectKey,
        UploadId: uploadId,
      });

      return await s3Client.send(command);
    } catch {
      // Local fallback
    }
  }

  const chunksDir = path.join(process.cwd(), "uploads", "chunks", uploadId);
  await fs.rm(chunksDir, { recursive: true, force: true }).catch(() => {});
}
