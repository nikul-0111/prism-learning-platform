"use client";

import { Video, FileText, HelpCircle, File, Edit2, Trash2, Eye, Check } from "lucide-react";
import { Lesson } from "@/lib/api/instructor-lesson.api";

interface LessonItemProps {
  lesson: Lesson;
  index: number;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
  onView?: (lesson: Lesson) => void;
}

export default function LessonItem({
  lesson,
  index,
  onEdit,
  onDelete,
  onView,
}: LessonItemProps) {
  const getIcon = () => {
    switch (lesson.type) {
      case "VIDEO":
        return <Video className="h-4 w-4 text-purple-600" />;
      case "ARTICLE":
        return <FileText className="h-4 w-4 text-emerald-600" />;
      case "QUIZ":
        return <HelpCircle className="h-4 w-4 text-amber-600" />;
      case "FILE":
        return <File className="h-4 w-4 text-blue-600" />;
      default:
        return <Video className="h-4 w-4 text-purple-600" />;
    }
  };

  const getTypeBg = () => {
    switch (lesson.type) {
      case "VIDEO":
        return "bg-purple-100/70 border-purple-200";
      case "ARTICLE":
        return "bg-emerald-100/70 border-emerald-200";
      case "QUIZ":
        return "bg-amber-100/70 border-amber-200";
      case "FILE":
        return "bg-blue-100/70 border-blue-200";
      default:
        return "bg-purple-100/70 border-purple-200";
    }
  };

  const hasContent = Boolean(lesson.videoUrl || lesson.content || lesson.type === "QUIZ" || lesson.quizId);

  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      
      {/* Left side: Icon, Title & Content indicator */}
      <div className="flex items-center gap-3">
        
        {/* Type Icon Badge */}
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${getTypeBg()}`}>
          {getIcon()}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Lecture {index + 1}:
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              {lesson.title}
            </h4>

            {lesson.isFreePreview && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700 border border-emerald-300">
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

          {/* Video URL or Content Summary */}
          {hasContent ? (
            <p className="mt-1 text-xs text-slate-500 truncate max-w-md flex items-center gap-1">
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="font-medium text-slate-600">Content Attached:</span>{" "}
              {lesson.type === "VIDEO"
                ? lesson.videoUrl
                : lesson.type === "QUIZ"
                ? "Quiz Assessment Ready"
                : "Article Text Ready"}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-amber-600 font-medium">
              + No video/content added yet
            </p>
          )}
        </div>

      </div>

      {/* Right side: Actions (View, Edit, Delete) */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {/* View / Preview Lesson */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView?.(lesson);
          }}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
          title="Preview Lesson Content"
        >
          <Eye className="h-3.5 w-3.5 text-indigo-600" />
          <span>View</span>
        </button>

        {/* Edit Details */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(lesson);
          }}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
          title="Edit Details"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(lesson.id);
          }}
          className="inline-flex items-center gap-1 rounded-xl border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
          title="Delete Lecture"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>

    </div>
  );
}
