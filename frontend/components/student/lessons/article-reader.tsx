"use client";

import { useState } from "react";
import { FileText, Clock, CheckCircle2 } from "lucide-react";

interface ArticleReaderProps {
  title: string;
  content?: string | null;
  onComplete?: () => void;
}

export default function ArticleReader({
  title,
  content,
  onComplete,
}: ArticleReaderProps) {
  const [completed, setCompleted] = useState(false);

  function handleMarkCompleted() {
    setCompleted(true);
    if (onComplete) onComplete();
  }

  // Calculate read time based on word count
  const words = content ? content.trim().split(/\s+/).length : 50;
  const readTimeMins = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <FileText className="h-3.5 w-3.5" /> Article Lesson
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
        </div>

        <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-600">
          <Clock className="h-4 w-4 text-emerald-600" />
          <span>{readTimeMins} min read</span>
        </div>
      </div>

      {/* Article Content Area */}
      <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed min-h-[150px]">
        {content ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <p className="text-slate-400 italic">No content text provided for this article lesson yet.</p>
        )}
      </div>

      {/* Footer Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Article Status</span>
        {completed ? (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md">
            <CheckCircle2 className="h-4 w-4" /> Marked as Read
          </div>
        ) : (
          <button
            type="button"
            onClick={handleMarkCompleted}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Mark as Completed</span>
          </button>
        )}
      </div>
    </div>
  );
}
