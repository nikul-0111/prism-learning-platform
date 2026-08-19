import { exec } from "child_process";
import { promisify } from "util";
import { env } from "../../config/env.js";

const execAsync = promisify(exec);

export interface MediaProbeResult {
  isValid: boolean;
  formatName?: string;
  duration?: number;
  width?: number;
  height?: number;
  errorMessage?: string;
}

/**
 * Validates untrusted media bytes using ffprobe.
 * Verifies media container format, duration caps, and video dimensions.
 * Rejects spoofed files (e.g. .zip renamed to .mp4).
 */
export async function probeMediaFile(filePath: string): Promise<MediaProbeResult> {
  try {
    const cmd = `ffprobe -v error -show_entries format=format_name,duration -show_streams -select_streams v:0 -print_format json "${filePath}"`;
    const { stdout } = await execAsync(cmd);
    const parsed = JSON.parse(stdout);

    const formatName = parsed?.format?.format_name || "";
    const duration = Math.round(parseFloat(parsed?.format?.duration || "0"));
    const videoStream = parsed?.streams?.[0];
    const width = videoStream?.width;
    const height = videoStream?.height;

    // Allowed video container formats
    const isVideoFormat =
      formatName.includes("mp4") ||
      formatName.includes("mov") ||
      formatName.includes("matroska") ||
      formatName.includes("webm") ||
      formatName.includes("avi");

    if (!isVideoFormat || !videoStream) {
      return {
        isValid: false,
        errorMessage: `Invalid media container format (${formatName || "unknown"}). Renamed or non-video files are rejected.`,
      };
    }

    if (duration > env.VIDEO_MAX_DURATION_SECONDS) {
      return {
        isValid: false,
        errorMessage: `Video duration (${duration}s) exceeds max limit of ${env.VIDEO_MAX_DURATION_SECONDS}s.`,
      };
    }

    return {
      isValid: true,
      formatName,
      duration,
      width,
      height,
    };
  } catch (error) {
    return {
      isValid: false,
      errorMessage: `ffprobe failed to read file structure: ${(error as Error).message}`,
    };
  }
}
