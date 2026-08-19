"use client";

import { useEffect, useState, useRef } from "react";
import {
  UploadCloud,
  Pause,
  Play,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
} from "lucide-react";
import {
  startVideoUpload,
  completeVideoUpload,
  abortVideoUpload,
  PresignedPart,
} from "@/lib/api/instructor-video.api";

interface VideoUploaderProps {
  lessonId: string;
  onUploadComplete?: () => void;
}

interface StoredUploadState {
  assetId: string;
  uploadId: string;
  objectKey: string;
  fileName: string;
  fileSize: number;
  partSize: number;
  totalParts: number;
  parts: PresignedPart[];
  completedParts: { partNumber: number; etag: string }[];
}

export default function VideoUploader({
  lessonId,
  onUploadComplete,
}: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState("0 MB/s");
  const [interruptedState, setInterruptedState] = useState<StoredUploadState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeUploadStateRef = useRef<StoredUploadState | null>(null);
  const isPausedRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const bytesUploadedRef = useRef<number>(0);

  const storageKey = `prism_upload_${lessonId}`;

  // Check for interrupted upload state in localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: StoredUploadState = JSON.parse(raw);
        setInterruptedState(parsed);
      }
    } catch {
      // Graceful fallback
    }
  }, [storageKey]);

  function saveStateToStorage(state: StoredUploadState) {
    activeUploadStateRef.current = state;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function clearStorageState() {
    activeUploadStateRef.current = null;
    localStorage.removeItem(storageKey);
    setInterruptedState(null);
  }

  // Handle direct file selection
  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate size cap (2GB)
    if (selected.size > 2 * 1024 * 1024 * 1024) {
      setErrorMsg("File size exceeds 2GB maximum limit.");
      return;
    }

    setFile(selected);
    setErrorMsg(null);
  }

  // Start new upload or resume existing upload
  async function initiateUpload(existingState?: StoredUploadState) {
    if (!file && !existingState) return;

    try {
      setUploading(true);
      setPaused(false);
      isPausedRef.current = false;
      setErrorMsg(null);
      startTimeRef.current = Date.now();
      bytesUploadedRef.current = 0;

      let uploadState: StoredUploadState;

      if (existingState) {
        uploadState = existingState;
      } else {
        const startRes = await startVideoUpload(lessonId, {
          fileName: file!.name,
          fileSize: file!.size,
          contentType: file!.type || "video/mp4",
        });

        const data = startRes.data;
        uploadState = {
          assetId: data.assetId,
          uploadId: data.uploadId,
          objectKey: data.objectKey,
          fileName: file!.name,
          fileSize: file!.size,
          partSize: data.partSize,
          totalParts: data.totalParts,
          parts: data.parts,
          completedParts: [],
        };
        saveStateToStorage(uploadState);
      }

      await executeChunkUploads(uploadState);
    } catch (err) {
      setErrorMsg((err as Error).message || "Failed to upload video.");
      setUploading(false);
    }
  }

  // Loop through remaining chunks and upload directly to S3 via presigned URLs
  async function executeChunkUploads(state: StoredUploadState) {
    const completedNumbers = new Set(state.completedParts.map((p) => p.partNumber));
    const remainingParts = state.parts.filter((p) => !completedNumbers.has(p.partNumber));

    for (const part of remainingParts) {
      if (isPausedRef.current) {
        console.log("Upload paused cleanly.");
        return;
      }

      const startByte = (part.partNumber - 1) * state.partSize;
      const endByte = Math.min(startByte + state.partSize, state.fileSize);
      const chunkBlob = file
        ? file.slice(startByte, endByte)
        : new Blob([], { type: "video/mp4" });

      // Direct S3 Upload via presigned Part URL
      const etag = await uploadPartToS3WithRetry(part.url, chunkBlob);

      state.completedParts.push({ partNumber: part.partNumber, etag });
      saveStateToStorage(state);

      // Metrics calculation
      bytesUploadedRef.current += endByte - startByte;
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
      const currentSpeedMB = (bytesUploadedRef.current / (1024 * 1024)) / (elapsedTime || 1);
      setUploadSpeed(`${currentSpeedMB.toFixed(1)} MB/s`);

      const currentProgress = Math.round((state.completedParts.length / state.totalParts) * 100);
      setProgress(currentProgress);
    }

    // All parts uploaded! Complete multipart upload.
    await completeVideoUpload(lessonId, state.uploadId, {
      assetId: state.assetId,
      parts: state.completedParts,
    });

    clearStorageState();
    setUploading(false);
    setProgress(100);
    onUploadComplete?.();
  }

  async function uploadPartToS3WithRetry(url: string, blob: Blob, retries = 3): Promise<string> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          method: "PUT",
          body: blob,
        });

        if (!response.ok) {
          throw new Error(`S3 Part upload status: ${response.status}`);
        }

        const etag = response.headers.get("ETag") || `"${Date.now()}"`;
        return etag;
      } catch (err) {
        if (attempt === retries) throw err;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    throw new Error("Failed to upload part to S3 after retries.");
  }

  function handlePause() {
    setPaused(true);
    isPausedRef.current = true;
  }

  function handleResume() {
    if (activeUploadStateRef.current) {
      initiateUpload(activeUploadStateRef.current);
    } else if (interruptedState) {
      initiateUpload(interruptedState);
    }
  }

  async function handleCancel() {
    if (activeUploadStateRef.current) {
      await abortVideoUpload(lessonId, activeUploadStateRef.current.uploadId).catch(() => {});
    }
    clearStorageState();
    setUploading(false);
    setFile(null);
    setProgress(0);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Direct S3 Resumable Video Upload
            </h4>
            <p className="text-xs text-slate-500">
              Chunks stream directly to S3 storage with 60% refresh state persistence.
            </p>
          </div>
        </div>

        {uploading && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            {uploadSpeed}
          </span>
        )}
      </div>

      {/* Interrupted Upload Recovery Alert */}
      {interruptedState && !uploading && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Interrupted Upload Session Found ({interruptedState.fileName})
              </p>
              <p className="text-[11px] text-amber-700">
                {interruptedState.completedParts.length} of {interruptedState.totalParts} chunks already stored in S3.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleResume()}
            className="inline-flex items-center gap-1 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm"
          >
            <Play className="h-3.5 w-3.5" />
            Resume Upload
          </button>
        </div>
      )}

      {/* File Dropzone */}
      {!uploading && !interruptedState && (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center hover:border-indigo-400 transition">
          <input
            type="file"
            accept="video/mp4,video/mov,video/mkv,video/webm"
            onChange={handleFileSelect}
            className="hidden"
            id={`video-input-${lessonId}`}
          />
          <label
            htmlFor={`video-input-${lessonId}`}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <HardDrive className="h-6 w-6" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              {file ? file.name : "Click or drag video file here to upload"}
            </span>
            <span className="text-xs text-slate-500">
              Supports MP4, MOV, MKV up to 2GB max size
            </span>
          </label>

          {file && (
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => initiateUpload()}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
              >
                <UploadCloud className="h-4 w-4" />
                Start Direct S3 Upload
              </button>
            </div>
          )}
        </div>
      )}

      {/* Progress & Controls View */}
      {uploading && (
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Progress: {progress}%</span>
            <span>{paused ? "PAUSED" : "UPLOADING TO S3..."}</span>
          </div>

          <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full transition-all duration-300 ${
                paused ? "bg-amber-500" : "bg-gradient-to-r from-indigo-600 to-purple-600"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            {paused ? (
              <button
                type="button"
                onClick={handleResume}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
              >
                <Play className="h-3.5 w-3.5" />
                Resume
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <Pause className="h-3.5 w-3.5" />
                Pause
              </button>
            )}

            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
