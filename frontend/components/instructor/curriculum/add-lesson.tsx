"use client";

import { useState, useEffect } from "react";
import { Video, FileText, HelpCircle, Check, X, Clock, Award, RotateCcw } from "lucide-react";
import { CreateLessonRequest, LessonType } from "@/lib/api/instructor-lesson.api";
import { QuestionInput } from "@/lib/api/instructor-quiz.api";
import QuestionBuilder from "./question-builder";

interface AddLessonProps {
  sectionId: string;
  onSave: (data: CreateLessonRequest) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    title: string;
    description?: string;
    type: LessonType;
    videoUrl?: string;
    content?: string;
    duration?: number;
    isFreePreview?: boolean;
    passMark?: number;
    timeLimit?: number;
    maxAttempts?: number;
    questions?: QuestionInput[];
  };
}

export default function AddLesson({
  onSave,
  onCancel,
  initialData,
}: AddLessonProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [type, setType] = useState<LessonType>(initialData?.type || "VIDEO");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [duration, setDuration] = useState(String(initialData?.duration || ""));
  const [isFreePreview, setIsFreePreview] = useState(Boolean(initialData?.isFreePreview));
  
  // Quiz Timeline & Rule Settings
  const [passMark, setPassMark] = useState(String(initialData?.passMark || "70"));
  const [timeLimit, setTimeLimit] = useState(String(initialData?.timeLimit || "15"));
  const [maxAttempts, setMaxAttempts] = useState(String(initialData?.maxAttempts || "3"));

  // Questions State
  const [questions, setQuestions] = useState<QuestionInput[]>(initialData?.questions || []);

  const [saving, setSaving] = useState(false);

  // Sync initialData when fetched asynchronously
  useEffect(() => {
    if (initialData?.questions && initialData.questions.length > 0) {
      setQuestions(initialData.questions);
    }
    if (initialData?.passMark) {
      setPassMark(String(initialData.passMark));
    }
    if (initialData?.timeLimit) {
      setTimeLimit(String(initialData.timeLimit));
    }
    if (initialData?.maxAttempts) {
      setMaxAttempts(String(initialData.maxAttempts));
    }
  }, [initialData?.questions, initialData?.passMark, initialData?.timeLimit, initialData?.maxAttempts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSaving(true);
      await onSave({
        title: title.trim(),
        type,
        videoUrl: type === "VIDEO" ? videoUrl.trim() || undefined : undefined,
        content: type === "ARTICLE" ? content.trim() || undefined : undefined,
        duration: type === "QUIZ" ? Number(timeLimit) || 15 : type === "VIDEO" ? Number(duration) || 0 : 0,
        isFreePreview,
        quizData: type === "QUIZ" ? {
          title: title.trim(),
          passMark: Number(passMark) || 70,
          timeLimit: Number(timeLimit) || 15,
          maxAttempts: Number(maxAttempts) || 3,
          questions,
        } : undefined,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
          {initialData ? "Edit Lesson Item" : "Create New Content Item"}
        </h4>
      </div>

      {/* Lesson Type Selector (Video, Article, Quiz) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setType("VIDEO")}
          className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition ${
            type === "VIDEO"
              ? "border-indigo-600 bg-white text-indigo-600 shadow-sm"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
          }`}
        >
          <Video className="h-4 w-4 text-purple-600" />
          Video
        </button>

        <button
          type="button"
          onClick={() => setType("ARTICLE")}
          className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition ${
            type === "ARTICLE"
              ? "border-indigo-600 bg-white text-indigo-600 shadow-sm"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
          }`}
        >
          <FileText className="h-4 w-4 text-emerald-600" />
          Article
        </button>

        <button
          type="button"
          onClick={() => setType("QUIZ")}
          className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition ${
            type === "QUIZ"
              ? "border-indigo-600 bg-white text-indigo-600 shadow-sm"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
          }`}
        >
          <HelpCircle className="h-4 w-4 text-amber-600" />
          Quiz
        </button>
      </div>

      {/* Lesson Title */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          {type === "QUIZ" ? "Quiz Title *" : "Lesson Title *"}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            type === "QUIZ"
              ? "e.g. React Fundamentals Assessment Quiz"
              : "e.g. Introduction to React Hooks"
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium"
          required
        />
      </div>

      {/* Conditional Video URL input */}
      {type === "VIDEO" && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Video URL / Embed Link
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://vimeo.com/... or https://youtube.com/..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      )}

      {/* Conditional Article Content input */}
      {type === "ARTICLE" && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Article Reading Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your lesson text or article reading material..."
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      )}

      {/* Conditional Quiz Timeline & Question Builder */}
      {type === "QUIZ" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>Quiz Timeline & Rules Setup</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Passing Mark */}
              <div>
                <label className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  Passing Mark (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={passMark}
                  onChange={(e) => setPassMark(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                  placeholder="70"
                />
              </div>

              {/* Time Limit */}
              <div>
                <label className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-indigo-600" />
                  Time Limit (mins)
                </label>
                <input
                  type="number"
                  min="1"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                  placeholder="15"
                />
              </div>

              {/* Max Attempts */}
              <div>
                <label className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                  <RotateCcw className="h-3.5 w-3.5 text-purple-600" />
                  Max Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                  placeholder="3"
                />
              </div>
            </div>
          </div>

          {/* Interactive Question Authoring Tool */}
          <QuestionBuilder
            questions={questions}
            onChange={(q) => setQuestions(q)}
          />
        </div>
      )}

      {/* Duration (Only for Video) & Free Preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {type === "VIDEO" ? (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700">
              Duration (min):
            </label>
            <input
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-20 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs outline-none focus:border-indigo-500"
              placeholder="10"
            />
          </div>
        ) : (
          <div />
        )}

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={isFreePreview}
            onChange={(e) => setIsFreePreview(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Free Preview
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-2 border-t border-indigo-100">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
          {saving ? "Saving..." : initialData ? "Update Item" : "Save Item"}
        </button>
      </div>
    </form>
  );
}
