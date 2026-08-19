import { prisma } from "../../lib/prisma.js";
import { abortMultipartUpload } from "./s3.service.js";

/**
 * Abandoned Multipart Upload Garbage Collection Service
 * Finds stale upload sessions (status === UPLOADING older than 24 hours)
 * and aborts S3/local multipart sessions to prevent orphaned storage cost.
 */
export async function cleanupStaleMultipartUploads(maxAgeHours: number = 24) {
  const cutoffDate = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);

  try {
    const staleAssets = await prisma.asset.findMany({
      where: {
        status: "UPLOADING",
        updatedAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(`[Garbage Collection] Found ${staleAssets.length} stale multipart uploads older than ${maxAgeHours} hours.`);

    let cleanedCount = 0;
    for (const asset of staleAssets) {
      if (asset.uploadId) {
        await abortMultipartUpload(asset.objectKey, asset.uploadId).catch(() => {});
      }
      await prisma.asset.delete({ where: { id: asset.id } }).catch(() => {});
      cleanedCount++;
    }

    console.log(`[Garbage Collection] Cleaned up ${cleanedCount} abandoned multipart upload assets.`);
    return cleanedCount;
  } catch (error) {
    console.error("[Garbage Collection ERROR] Failed to clean up stale uploads:", error);
    return 0;
  }
}
