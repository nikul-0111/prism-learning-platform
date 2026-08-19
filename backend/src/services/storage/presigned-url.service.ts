import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../config/s3.js";
import { env } from "../../config/env.js";

/**
 * Generates a short-lived signed URL for an S3 or local object key.
 */
export async function getShortLivedSignedUrl(
  objectKey: string,
  expiresInSeconds: number = 900
): Promise<string> {
  if (objectKey.startsWith("uploads/") || objectKey.startsWith("http")) {
    if (objectKey.startsWith("http")) return objectKey;
    return `http://localhost:${env.PORT}/${objectKey}`;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: objectKey,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  } catch {
    return `http://localhost:${env.PORT}/${objectKey}`;
  }
}
