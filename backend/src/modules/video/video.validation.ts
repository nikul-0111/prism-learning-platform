import { z } from "zod";

export const startUploadSchema = z.object({
  fileName: z.string().min(1, "fileName is required"),
  fileSize: z.number().positive("fileSize must be positive"),
  contentType: z.string().min(1, "contentType is required"),
});

export const completeUploadSchema = z.object({
  assetId: z.string().uuid("Invalid assetId"),
  parts: z.array(
    z.object({
      partNumber: z.number().int().positive(),
      etag: z.string().min(1),
    })
  ).min(1, "At least 1 part is required"),
});

export type StartUploadInput = z.infer<typeof startUploadSchema>;
export type CompleteUploadInput = z.infer<typeof completeUploadSchema>;
