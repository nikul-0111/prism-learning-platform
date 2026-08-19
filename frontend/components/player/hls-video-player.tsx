"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Loader2,
} from "lucide-react";

interface HLSVideoPlayerProps {
  src: string;
  poster?: string | null;
  onTimeUpdate?: (currentTime: number) => void;
}

export default function HLSVideoPlayer({
  src,
  poster,
  onTimeUpdate,
}: HLSVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [qualityLevels, setQualityLevels] = useState<{ id: number; name: string }[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const [downloading, setDownloading] = useState(false);

  // Prepend backend origin if relative path is passed
  const formattedSrc = src.startsWith("http")
    ? src
    : `http://localhost:5000${src.startsWith("/") ? "" : "/"}${src}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const isHls = formattedSrc.includes(".m3u8") || formattedSrc.includes("/hls/");

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: false,
      });

      hls.loadSource(formattedSrc);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const levels = data.levels.map((l, index) => ({
          id: index,
          name: `${l.height}p HD`,
        }));
        setQualityLevels(levels);
      });

      return () => {
        hls.destroy();
      };
    } else {
      // Direct raw video file stream
      video.src = formattedSrc;
    }
  }, [src, formattedSrc]);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Playback error / autoplay prevented:", err);
      }
    }
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (onTimeUpdate) {
      onTimeUpdate(video.currentTime);
    }
  }

  function handleLoadedMetadata() {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }

  function changeSpeed(rate: number) {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  }

  function changeQuality(levelIndex: number) {
    setSelectedQuality(levelIndex);

    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      hlsRef.current.loadLevel = levelIndex;
    }
  }

  function toggleFullScreen() {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  }

  async function handleDownload() {
    try {
      setDownloading(true);
      const response = await fetch(formattedSrc);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `lecture_video.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl group">
      {/* Main Video Element */}
      <video
        ref={videoRef}
        poster={poster || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        crossOrigin="anonymous"
        className="w-full h-full object-contain cursor-pointer bg-slate-950 min-h-[300px]"
      />

      {/* Modern Control Overlay Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col gap-2.5 z-20">
        {/* Progress Timeline Slider */}
        <div className="relative flex items-center w-full">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer hover:h-2 transition-all"
          />
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-white text-xs font-semibold">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
            </button>

            {/* Mute/Volume */}
            <button
              type="button"
              onClick={toggleMute}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-slate-200" />}
            </button>

            {/* Duration Timestamp */}
            <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-md cursor-pointer disabled:opacity-60"
            >
              {downloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>Download</span>
            </button>

            {/* Speed Selector */}
            <select
              value={playbackRate}
              onChange={(e) => changeSpeed(parseFloat(e.target.value))}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold transition outline-none cursor-pointer border border-slate-700"
            >
              <option value={0.5} className="bg-slate-900 text-white">0.5x</option>
              <option value={1.0} className="bg-slate-900 text-white">1.0x (Normal)</option>
              <option value={1.25} className="bg-slate-900 text-white">1.25x</option>
              <option value={1.5} className="bg-slate-900 text-white">1.5x</option>
              <option value={2.0} className="bg-slate-900 text-white">2.0x</option>
            </select>

            {/* Quality Selector */}
            {qualityLevels.length > 0 && (
              <select
                value={selectedQuality}
                onChange={(e) => changeQuality(parseInt(e.target.value))}
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold transition outline-none cursor-pointer border border-slate-700"
              >
                <option value={-1} className="bg-slate-900 text-white">Auto Quality</option>
                {qualityLevels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id} className="bg-slate-900 text-white">
                    {lvl.name}
                  </option>
                ))}
              </select>
            )}

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullScreen}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
