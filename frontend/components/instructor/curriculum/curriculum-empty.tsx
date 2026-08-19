"use client";

import { BookOpen, Plus } from "lucide-react";

interface CurriculumEmptyProps {
  onAddSection: () => void;
}

export default function CurriculumEmpty({
  onAddSection,
}: CurriculumEmptyProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
        <BookOpen className="h-8 w-8 text-indigo-600" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-slate-900">
        No sections yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Start building your course curriculum by creating your first
        section. You can add lessons inside each section later.
      </p>

      <button
        type="button"
        onClick={onAddSection}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" />
        Create First Section
      </button>
    </div>
  );
}