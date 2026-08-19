"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Plus,
  Layers,
} from "lucide-react";

import DashboardEmpty from "./dashboard-empty";
import CourseCard from "@/components/instructor/courses/course-card";
import { getAllCourses, Course } from "@/lib/api/instructor-course.api";

export default function RecentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  useEffect(() => {
    async function loadRecentCourses() {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("prism_token");
        if (!token) {
          setLoading(false);
          return;
        }
      }

      try {
        setLoading(true);
        const res = await getAllCourses();
        if (res?.courses) {
          setCourses(res.courses);
        }
      } catch (err) {
        console.error("Failed to load recent courses:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRecentCourses();
  }, []);

  function handleCourseDeleted(deletedId: string) {
    setCourses((prev) => prev.filter((c) => c.id !== deletedId));
  }

  const filteredCourses = useMemo(() => {
    let result = courses;
    if (filter === "PUBLISHED") {
      result = courses.filter(
        (c) => (c.status || "").toUpperCase() === "PUBLISHED"
      );
    } else if (filter === "DRAFT") {
      result = courses.filter(
        (c) => (c.status || "DRAFT").toUpperCase() === "DRAFT"
      );
    }
    return result.slice(0, 6); // Take top 6 for dashboard grid
  }, [courses, filter]);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Course Management
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Recent Courses
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your recently created courses and curriculum modules.
          </p>
        </div>

        {/* Filter Pills & View All */}
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "ALL"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({courses.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter("PUBLISHED")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "PUBLISHED"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Live
            </button>

            <button
              type="button"
              onClick={() => setFilter("DRAFT")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "DRAFT"
                  ? "bg-white text-amber-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Drafts
            </button>
          </div>

          <Link
            href="/instructor/courses"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100"
          >
            <span>All Courses</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <DashboardEmpty />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onDeleted={handleCourseDeleted}
            />
          ))}
        </div>
      )}
    </section>
  );
}