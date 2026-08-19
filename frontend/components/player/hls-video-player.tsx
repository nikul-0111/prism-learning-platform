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
  Settings,
  Check,
  ChevronRight,
  Maximize2,
  RotateCcw,
} from "lucide-react";

interface HLSVideoPlayerProps {
  src: string;
  poster?: string | null;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

export default function HLSVideoPlayer({
  src,
  poster,
  onTimeUpdate,
  onEnded,
}: HLSVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [qualityLevels, setQualityLevels] = useState<{ id: number; name: string }[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);
  const [downloading, setDownloading] = useState(false);

  // Settings Menu Popover State
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"main" | "speed" | "quality">("main");

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
          name: `${l.height || 720}p ${l.height >= 720 ? "HD" : "SD"}`,
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

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  }

  function changeSpeed(rate: number) {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  }

  function changeQuality(levelIndex: number) {
    setSelectedQuality(levelIndex);

    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      hlsRef.current.loadLevel = levelIndex;
    }
    setShowSettings(false);
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

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div className="relative w-full aspect-video max-h-[520px] flex flex-col justify-between overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl group select-none">
      {/* Main Video Element */}
      <video
        ref={videoRef}
        poster={poster || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        onClick={togglePlay}
        crossOrigin="anonymous"
        className="w-full h-full aspect-video max-h-[520px] object-contain cursor-pointer bg-slate-950"
      />

      {/* Center Play/Pause Overlay Animation Button */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/90 text-white backdrop-blur-md shadow-2xl transition hover:scale-110 hover:bg-indigo-600 cursor-pointer z-10"
        >
          <Play className="h-7 w-7 fill-white ml-1" />
        </button>
      )}

      {/* Modern Control Overlay Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col gap-3 z-20">
        
        {/* Progress Timeline Slider */}
        <div className="relative flex items-center w-full group/timeline">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 accent-indigo-500 bg-slate-800/80 rounded-lg cursor-pointer hover:h-2 transition-all"
          />
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-white text-xs font-semibold">
          
          {/* Left Controls: Play, Volume, Timestamp */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/30 cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
            </button>

            {/* Volume Control Slider */}
            <div className="flex items-center gap-2 group/vol">
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-slate-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-slate-200" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 accent-indigo-500 bg-slate-700 rounded-lg cursor-pointer hidden sm:block"
              />
            </div>

            {/* Duration Timestamp */}
            <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls: Settings Popover, Download, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            
            {/* Settings Popover Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSettings(!showSettings);
                  setSettingsTab("main");
                }}
                className={`flex h-9 items-center gap-1.5 px-3 rounded-xl border transition cursor-pointer ${
                  showSettings
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                    : "bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700"
                }`}
                title="Video Playback Settings"
              >
                <Settings className={`h-4 w-4 ${showSettings ? "animate-spin" : ""}`} />
                <span className="text-[11px] font-extrabold hidden sm:inline">Settings</span>
              </button>

              {/* Floating Settings Popover Menu */}
              {showSettings && (
                <div className="absolute right-0 bottom-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 text-slate-200">
                  
                  {settingsTab === "main" && (
                    <div className="space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase text-indigo-400 tracking-wider border-b border-slate-800">
                        Player Settings
                      </div>

                      {/* Speed Setting Link */}
                      <button
                        type="button"
                        onClick={() => setSettingsTab("speed")}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                      >
                        <span>Playback Speed</span>
                        <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                          {playbackRate === 1.0 ? "Normal (1.0x)" : `${playbackRate}x`}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </button>

                      {/* Quality Setting Link */}
                      <button
                        type="button"
                        onClick={() => setSettingsTab("quality")}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                      >
                        <span>Stream Quality</span>
                        <span className="flex items-center gap-1 text-indigo-400 font-extrabold text-[11px]">
                          {selectedQuality === -1
                            ? "Auto"
                            : qualityLevels.find((q) => q.id === selectedQuality)?.name || "Auto"}
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Speed Submenu */}
                  {settingsTab === "speed" && (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setSettingsTab("main")}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold text-indigo-400 hover:text-white transition cursor-pointer"
                      >
                        ← Back to Settings
                      </button>
                      <div className="my-1 border-t border-slate-800" />
                      {speedOptions.map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => changeSpeed(rate)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                            playbackRate === rate
                              ? "bg-indigo-600 text-white"
                              : "text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          <span>{rate === 1.0 ? "1.0x (Normal)" : `${rate}x`}</span>
                          {playbackRate === rate && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quality Submenu */}
                  {settingsTab === "quality" && (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setSettingsTab("main")}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold text-indigo-400 hover:text-white transition cursor-pointer"
                      >
                        ← Back to Settings
                      </button>
                      <div className="my-1 border-t border-slate-800" />
                      <button
                        type="button"
                        onClick={() => changeQuality(-1)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                          selectedQuality === -1
                            ? "bg-indigo-600 text-white"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span>Auto (Adaptive Bitrate)</span>
                        {selectedQuality === -1 && <Check className="h-3.5 w-3.5" />}
                      </button>
                      {qualityLevels.map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => changeQuality(lvl.id)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                            selectedQuality === lvl.id
                              ? "bg-indigo-600 text-white"
                              : "text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          <span>{lvl.name}</span>
                          {selectedQuality === lvl.id && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Download Video Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-md cursor-pointer disabled:opacity-60"
              title="Download Lecture Video"
            >
              {downloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span className="hidden md:inline">Download</span>
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullScreen}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
              title="Fullscreen Mode"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
