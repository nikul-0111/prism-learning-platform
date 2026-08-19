"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Menu,
} from "lucide-react";

export default function InstructorMobileNav() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
      {/* Logo */}
      <Link
        href="/instructor/dashboard"
        className="flex items-center gap-2"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>

        <div>
          <p className="text-lg font-bold text-slate-900">
            PRISM
          </p>

          <p className="-mt-1 text-[10px] font-medium text-slate-500">
            Instructor Studio
          </p>
        </div>
      </Link>

      {/* Mobile Actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/instructor/courses"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Courses"
        >
          <BookOpen className="h-5 w-5" />
        </Link>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}