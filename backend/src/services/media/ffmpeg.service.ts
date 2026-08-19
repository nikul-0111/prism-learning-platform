import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";

export interface TranscodeOptions {
  inputPath: string;
  outputDir: string;
  onProgress?: (progressPercent: number, statusMessage: string) => void;
}

export interface TranscodeOutputs {
  masterPlaylistPath: string;
  thumbnailPath: string;
  spriteSheetPath: string;
  hlsDir: string;
}

/**
 * FFmpeg Encoding Ladder & HLS Packaging Service
 * Builds 360p, 720p, and 1080p adaptive HLS streams, poster thumbnail, and scrubbing tile sprite.
 */
export async function transcodeToHLS(options: TranscodeOptions): Promise<TranscodeOutputs> {
  const { inputPath, outputDir, onProgress } = options;

  const hlsDir = path.join(outputDir, "hls");
  const p360Dir = path.join(hlsDir, "360p");
  const p720Dir = path.join(hlsDir, "720p");
  const p1080Dir = path.join(hlsDir, "1080p");
  const thumbnailsDir = path.join(outputDir, "thumbnails");
  const spritesDir = path.join(outputDir, "sprites");

  await fs.mkdir(p360Dir, { recursive: true });
  await fs.mkdir(p720Dir, { recursive: true });
  await fs.mkdir(p1080Dir, { recursive: true });
  await fs.mkdir(thumbnailsDir, { recursive: true });
  await fs.mkdir(spritesDir, { recursive: true });

  onProgress?.(15, "Starting 360p HLS transcode...");

  // 1. Transcode 360p rendition
  const cmd360 = `ffmpeg -y -i "${inputPath}" -vf "scale=w=640:h=360:force_original_aspect_ratio=decrease" -c:v libx264 -preset medium -b:v 800k -maxrate 900k -bufsize 1200k -g 48 -keyint_min 48 -sc_threshold 0 -c:a aac -b:a 96k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${p360Dir}/segment%03d.ts" "${p360Dir}/playlist.m3u8"`;
  await runFFmpegCmd(cmd360);

  onProgress?.(45, "Starting 720p HLS transcode...");

  // 2. Transcode 720p rendition
  const cmd720 = `ffmpeg -y -i "${inputPath}" -vf "scale=w=1280:h=720:force_original_aspect_ratio=decrease" -c:v libx264 -preset medium -b:v 2500k -maxrate 2800k -bufsize 3600k -g 48 -keyint_min 48 -sc_threshold 0 -c:a aac -b:a 128k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${p720Dir}/segment%03d.ts" "${p720Dir}/playlist.m3u8"`;
  await runFFmpegCmd(cmd720);

  onProgress?.(75, "Starting 1080p HLS transcode...");

  // 3. Transcode 1080p rendition
  const cmd1080 = `ffmpeg -y -i "${inputPath}" -vf "scale=w=1920:h=1080:force_original_aspect_ratio=decrease" -c:v libx264 -preset medium -b:v 5000k -maxrate 5500k -bufsize 7000k -g 48 -keyint_min 48 -sc_threshold 0 -c:a aac -b:a 192k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${p1080Dir}/segment%03d.ts" "${p1080Dir}/playlist.m3u8"`;
  await runFFmpegCmd(cmd1080);

  onProgress?.(90, "Packaging Master HLS Playlist & Extracting Thumbnails...");

  // 4. Generate master.m3u8 playlist
  const masterPlaylistContent = `#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=900000,RESOLUTION=640x360
360p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=5500000,RESOLUTION=1920x1080
1080p/playlist.m3u8
`;
  const masterPlaylistPath = path.join(hlsDir, "master.m3u8");
  await fs.writeFile(masterPlaylistPath, masterPlaylistContent, "utf8");

  // 5. Extract poster thumbnail
  const thumbnailPath = path.join(thumbnailsDir, "thumbnail.jpg");
  const thumbnailCmd = `ffmpeg -y -ss 00:00:02 -i "${inputPath}" -vframes 1 -q:v 2 "${thumbnailPath}"`;
  await runFFmpegCmd(thumbnailCmd);

  // 6. Generate tile sprite sheet for scrubbing preview
  const spriteSheetPath = path.join(spritesDir, "sprite.jpg");
  const spriteCmd = `ffmpeg -y -i "${inputPath}" -vf "fps=1/5,scale=160:90,tile=10x10" -q:v 3 "${spriteSheetPath}"`;
  await runFFmpegCmd(spriteCmd);

  onProgress?.(100, "Transcoding & Packaging Complete.");

  return {
    masterPlaylistPath,
    thumbnailPath,
    spriteSheetPath,
    hlsDir,
  };
}

function runFFmpegCmd(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`FFmpeg error: ${error.message}\nStderr: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}
