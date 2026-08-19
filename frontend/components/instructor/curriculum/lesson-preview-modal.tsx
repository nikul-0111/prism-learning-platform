"use client";

import { useEffect, useState } from "react";
import {
  X,
  Video,
  FileText,
  HelpCircle,
  File,
  Eye,
  Edit2,
  Clock,
  CheckCircle2,
  Award,
  RotateCcw,
  AlertCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Lesson } from "@/lib/api/instructor-lesson.api";
import { QuizData, getQuiz } from "@/lib/api/instructor-quiz.api";
import { getSignedPlayback, PlaybackUrlsResponse } from "@/lib/api/instructor-video.api";
import VideoUploader from "../video/video-uploader";
import TranscodeStatus from "../video/transcode-status";
import HLSVideoPlayer from "@/components/player/hls-video-player";

interface LessonPreviewModalProps {
  lesson: Lesson;
  onClose: () => void;
  onEdit: (lesson: Lesson) => void;
}

export default function LessonPreviewModal({
  lesson,
  onClose,
  onEdit,
}: LessonPreviewModalProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [playbackData, setPlaybackData] = useState<PlaybackUrlsResponse["data"] | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingPlayback, setLoadingPlayback] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (lesson.type === "QUIZ") {
      async function loadQuiz() {
        try {
          setLoadingQuiz(true);
          const res = await getQuiz(lesson.id);
          if (res?.data?.quiz) {
            setQuizData(res.data.quiz);
          }
        } catch (err) {
          console.error("Error loading quiz preview:", err);
        } finally {
          setLoadingQuiz(false);
        }
      }
      loadQuiz();
    } else if (lesson.type === "VIDEO") {
      loadSignedPlayback();
    }
  }, [lesson]);

  async function loadSignedPlayback() {
    try {
      setLoadingPlayback(true);
      const res = await getSignedPlayback(lesson.id);
      if (res?.data) {
        setPlaybackData(res.data);
      }
    } catch {
      // Playback signature failed (e.g. video not ready or no video uploaded)
    } finally {
      setLoadingPlayback(false);
    }
  }

  const getTypeIcon = () => {
    switch (lesson.type) {
      case "VIDEO":
        return <Video className="h-5 w-5 text-purple-600" />;
      case "ARTICLE":
        return <FileText className="h-5 w-5 text-emerald-600" />;
      case "QUIZ":
        return <HelpCircle className="h-5 w-5 text-amber-600" />;
      case "FILE":
        return <File className="h-5 w-5 text-blue-600" />;
      default:
        return <Video className="h-5 w-5 text-purple-600" />;
    }
  };

  const getTypeBadge = () => {
    switch (lesson.type) {
      case "VIDEO":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "ARTICLE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "QUIZ":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "FILE":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in ${isFullscreen ? "p-0" : "p-4 md:p-6"}`}>
      <div className={`relative flex flex-col bg-white shadow-2xl transition-all duration-300 overflow-hidden ${
        isFullscreen ? "w-full h-full rounded-none border-0" : "w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-200"
      }`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm">
              {getTypeIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${getTypeBadge()}`}
                >
                  {lesson.type}
                </span>
                {lesson.isFreePreview && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-extrabold text-emerald-700 border border-emerald-300">
                    <Eye className="h-3 w-3" />
                    Free Preview
                  </span>
                )}
                {lesson.duration ? (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                    {lesson.duration} min
                  </span>
                ) : null}
              </div>
              <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                {lesson.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen Expand Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white transition cursor-pointer border border-slate-200"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Expand Mode"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-4 w-4" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Lesson Content Preview */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {lesson.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description / Objectives
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {lesson.description}
              </p>
            </div>
          )}

          {lesson.type === "VIDEO" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Video Player & HLS Stream Settings
                </h4>
                <button
                  type="button"
                  onClick={() => setShowUploader(!showUploader)}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  {showUploader ? "Close Video Uploader" : "Re-upload / Replace Video"}
                </button>
              </div>

              {/* Upload Zone */}
              {showUploader && (
                <VideoUploader
                  lessonId={lesson.id}
                  onUploadComplete={() => {
                    setShowUploader(false);
                  }}
                />
              )}

              {/* Transcode Progress Timeline */}
              <TranscodeStatus
                lessonId={lesson.id}
                onReady={() => {
                  loadSignedPlayback();
                }}
              />

              {/* Adaptive HLS Video Player */}
              {playbackData?.masterPlaylistUrl ? (
                <div className="space-y-2 pt-2">
                  <h5 className="text-xs font-bold text-slate-700">
                    Secure Student HLS Video Player (Short-Lived Signed URLs)
                  </h5>
                  <HLSVideoPlayer
                    src={playbackData.masterPlaylistUrl}
                    poster={playbackData.thumbnailUrl}
                  />
                </div>
              ) : (
                !showUploader && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center space-y-3">
                    <Video className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">
                      No Transcoded Video Available Yet
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowUploader(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                    >
                      Upload Video File
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {lesson.type === "ARTICLE" && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Article Content
              </h4>
              {lesson.content ? (
                <div className="prose prose-slate max-w-none rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {lesson.content}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-6 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-amber-600 mb-2" />
                  <p className="text-sm font-semibold text-amber-800">
                    No Article Content Written Yet
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Click "Edit Lesson" to write lecture notes or article text for students.
                  </p>
                </div>
              )}
            </div>
          )}

          {lesson.type === "QUIZ" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quiz Assessment Structure & Questions
              </h4>

              {loadingQuiz ? (
                <div className="py-8 text-center text-xs text-slate-500 font-medium">
                  Loading Quiz Assessment Details...
                </div>
              ) : quizData ? (
                <div className="space-y-4">
                  {/* Quiz Rules Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center">
                      <Award className="mx-auto h-5 w-5 text-emerald-600 mb-1" />
                      <span className="block text-[10px] font-extrabold uppercase text-emerald-800">Passing Grade</span>
                      <span className="text-sm font-black text-emerald-900">{quizData.passMark}%</span>
                    </div>

                    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 text-center">
                      <Clock className="mx-auto h-5 w-5 text-indigo-600 mb-1" />
                      <span className="block text-[10px] font-extrabold uppercase text-indigo-800">Time Limit</span>
                      <span className="text-sm font-black text-indigo-900">{quizData.timeLimit} mins</span>
                    </div>

                    <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3 text-center">
                      <RotateCcw className="mx-auto h-5 w-5 text-purple-600 mb-1" />
                      <span className="block text-[10px] font-extrabold uppercase text-purple-800">Max Attempts</span>
                      <span className="text-sm font-black text-purple-900">{quizData.maxAttempts}</span>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-700">
                      Questions List ({quizData.questions?.length || 0})
                    </h5>

                    {quizData.questions && quizData.questions.length > 0 ? (
                      quizData.questions.map((q, qIdx) => (
                        <div key={q.id || qIdx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h6 className="text-xs font-extrabold text-slate-900">
                              Q{qIdx + 1}. {q.text}
                            </h6>
                            <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 shrink-0">
                              {q.type}
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {q.answers?.map((ans, aIdx) => (
                              <div
                                key={ans.id || aIdx}
                                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium border ${
                                  ans.isCorrect
                                    ? "border-emerald-300 bg-emerald-100/60 text-emerald-900 font-bold"
                                    : "border-slate-200 bg-white text-slate-700"
                                }`}
                              >
                                {ans.isCorrect ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                                )}
                                <span>{ans.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No questions added yet.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-6 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-amber-600 mb-2" />
                  <p className="text-sm font-semibold text-amber-800">
                    No Quiz Questions Configured Yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Close Preview
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(lesson);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-md transition cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Lesson Content
          </button>
        </div>
      </div>
    </div>
  );
}
