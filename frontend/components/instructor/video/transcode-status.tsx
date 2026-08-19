"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  Film,
  Layers,
  Sparkles,
} from "lucide-react";
import { getVideoStatus, VideoStatusResponse } from "@/lib/api/instructor-video.api";

interface TranscodeStatusProps {
  lessonId: string;
  onReady?: () => void;
}

export default function TranscodeStatus({
  lessonId,
  onReady,
}: TranscodeStatusProps) {
  const [statusData, setStatusData] = useState<VideoStatusResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function checkStatus() {
      try {
        const res = await getVideoStatus(lessonId);
        if (res?.data) {
          setStatusData(res.data);
          if (res.data.status === "READY") {
            onReady?.();
          }
        }
      } catch {
        // Silently handle transient network polling failures
      } finally {
        setLoading(false);
      }
    }

    checkStatus();

    // Poll status every 3 seconds if processing is active
    intervalId = setInterval(() => {
      if (statusData?.status && ["READY", "FAILED", "NOT_STARTED"].includes(statusData.status)) {
        clearInterval(intervalId);
        return;
      }
      checkStatus();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [lessonId, statusData?.status, onReady]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!statusData || statusData.status === "NOT_STARTED") {
    return null;
  }

  const isComplete = statusData.status === "READY";
  const isFailed = statusData.status === "FAILED";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isComplete
                ? "bg-emerald-100 text-emerald-600"
                : isFailed
                ? "bg-red-100 text-red-600"
                : "bg-indigo-100 text-indigo-600"
            }`}
          >
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : isFailed ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <RefreshCw className="h-5 w-5 animate-spin" />
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {isComplete
                ? "Video Transcoding & HLS Packaging Ready"
                : isFailed
                ? "Transcoding Pipeline Failed"
                : "Live FFmpeg Transcoding Pipeline Active"}
            </h4>
            <p className="text-xs text-slate-500">
              {isComplete
                ? "Multi-bitrate HLS streams (360p, 720p, 1080p) are ready for students."
                : isFailed
                ? "Untrusted bytes or transcode error occurred."
                : `Current Status: ${statusData.status}`}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border ${
            isComplete
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : isFailed
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-indigo-50 text-indigo-700 border-indigo-200"
          }`}
        >
          {statusData.status}
        </span>
      </div>

      {/* Processing Timeline Steps */}
      {!isFailed && (
        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
          <div
            className={`p-2.5 rounded-xl border ${
              ["QUEUED", "PROBING", "TRANSCODING", "PACKAGING", "READY"].includes(statusData.status)
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
          >
            <CheckCircle2 className="mx-auto h-4 w-4 mb-1" />
            1. S3 Complete
          </div>

          <div
            className={`p-2.5 rounded-xl border ${
              ["PROBING", "TRANSCODING", "PACKAGING", "READY"].includes(statusData.status)
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
          >
            <Film className="mx-auto h-4 w-4 mb-1" />
            2. ffprobe Bytes
          </div>

          <div
            className={`p-2.5 rounded-xl border ${
              ["TRANSCODING", "PACKAGING", "READY"].includes(statusData.status)
                ? "bg-indigo-50 border-indigo-200 text-indigo-800 font-bold"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
          >
            <Layers className="mx-auto h-4 w-4 mb-1" />
            3. FFmpeg ({statusData.progress}%)
          </div>

          <div
            className={`p-2.5 rounded-xl border ${
              statusData.status === "READY"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
          >
            <Sparkles className="mx-auto h-4 w-4 mb-1" />
            4. HLS Ready
          </div>
        </div>
      )}

      {/* Progress Bar for Active Transcode */}
      {!isComplete && !isFailed && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Overall Transcode Progress</span>
            <span>{statusData.progress}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
              style={{ width: `${statusData.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stderr Error Log View */}
      {isFailed && statusData.errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-1">
          <p className="text-xs font-bold text-red-900">Worker Stderr Log Output:</p>
          <p className="text-xs font-mono text-red-700 whitespace-pre-wrap bg-white p-2.5 rounded-xl border border-red-200">
            {statusData.errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}
