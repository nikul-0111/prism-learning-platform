"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CurriculumHeaderProps {
  courseTitle: string;
  onAddSection: () => void;
}

export default function CurriculumHeader({
  courseTitle,
  onAddSection,
}: CurriculumHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </button>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Course Curriculum
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {courseTitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddSection}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </button>
      </div>
    </div>
  );
}