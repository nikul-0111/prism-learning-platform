import { Queue } from "bullmq";
import { redisConnectionOptions } from "../config/redis.js";

export interface TranscodeJobData {
  assetId: string;
  lessonId: string;
  objectKey: string;
}

export const TRANSCODE_QUEUE_NAME = "video-transcode-queue";

export const transcodeQueue = new Queue<TranscodeJobData>(TRANSCODE_QUEUE_NAME, {
  connection: redisConnectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

export async function enqueueTranscodeJob(data: TranscodeJobData) {
  return transcodeQueue.add(`transcode-${data.assetId}`, data, {
    jobId: data.assetId, // Ensures idempotency (prevents duplicate jobs for same asset)
  });
}
