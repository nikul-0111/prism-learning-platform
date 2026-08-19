"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Plus,
} from "lucide-react";

export default function DashboardEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <BookOpen className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        No courses yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        You haven&apos;t created any courses yet. Start building
        your first course and create an engaging learning
        experience for your students.
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/instructor/courses/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />

          Create Course
        </Link>

        <Link
          href="/instructor/courses"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View Courses

          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}