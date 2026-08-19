"use client";

import {
  BookOpen,
  ChevronDown,
  Edit,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";

import type { Section } from "@/lib/api/instructor-section.api";

interface SectionItemProps {
  section: Section;
  onEdit: (section: Section) => void;
  onDelete: (section: Section) => void;
  onAddLesson: (section: Section) => void;
}

export default function SectionItem({
  section,
  onEdit,
  onDelete,
  onAddLesson,
}: SectionItemProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          type="button"
          className="cursor-grab text-slate-400 hover:text-slate-600"
          aria-label="Drag section"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
          <BookOpen className="h-5 w-5 text-indigo-600" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {section.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Section {section.position + 1}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAddLesson(section)}
          className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:flex"
        >
          <Plus className="h-4 w-4" />
          Add Lesson
        </button>

        <button
          type="button"
          onClick={() => onEdit(section)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
          aria-label="Edit section"
        >
          <Edit className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(section)}
          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          aria-label="Delete section"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
        <p className="text-sm text-slate-500">
          {section.description || "No description added."}
        </p>

        <button
          type="button"
          onClick={() => onAddLesson(section)}
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:hidden"
        >
          <Plus className="h-4 w-4" />
          Add Lesson
        </button>
      </div>
    </div>
  );
}