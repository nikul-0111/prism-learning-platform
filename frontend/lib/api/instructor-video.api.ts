import { get, post, del } from "./client";

export interface PresignedPart {
  partNumber: number;
  url: string;
}

export interface StartUploadResponse {
  message?: string;
  data: {
    assetId: string;
    uploadId: string;
    objectKey: string;
    partSize: number;
    totalParts: number;
    parts: PresignedPart[];
  };
}

export interface VideoStatusResponse {
  message?: string;
  data: {
    assetId?: string;
    status: "NOT_STARTED" | "UPLOADING" | "UPLOADED" | "VALIDATING" | "QUEUED" | "PROBING" | "TRANSCODING" | "PACKAGING" | "READY" | "FAILED";
    progress: number;
    duration?: number;
    errorMessage?: string;
  };
}

export interface PlaybackUrlsResponse {
  message?: string;
  playbackUrl?: string;
  data?: {
    lessonId: string;
    title: string;
    masterPlaylistUrl: string;
    thumbnailUrl?: string | null;
    spriteSheetUrl?: string | null;
    expiresInSeconds: number;
  };
}

export async function startVideoUpload(
  lessonId: string,
  data: { fileName: string; fileSize: number; contentType: string }
): Promise<StartUploadResponse> {
  return post<StartUploadResponse>(`/instructor/lessons/${lessonId}/video/uploads`, data);
}

export async function completeVideoUpload(
  lessonId: string,
  uploadId: string,
  data: { assetId: string; parts: { partNumber: number; etag: string }[] }
): Promise<{ message?: string }> {
  return post<{ message?: string }>(`/instructor/lessons/${lessonId}/video/uploads/${uploadId}/complete`, data);
}

export async function abortVideoUpload(
  lessonId: string,
  uploadId: string
): Promise<{ message?: string }> {
  return del<{ message?: string }>(`/instructor/lessons/${lessonId}/video/uploads/${uploadId}`);
}

export async function getVideoStatus(lessonId: string): Promise<VideoStatusResponse> {
  return get<VideoStatusResponse>(`/instructor/lessons/${lessonId}/video/status`);
}

export async function getSignedPlayback(lessonId: string): Promise<PlaybackUrlsResponse> {
  return get<PlaybackUrlsResponse>(`/videos/${lessonId}/playback`);
}
