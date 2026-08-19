"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  FileEdit,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { getAllCourses, Course } from "@/lib/api/instructor-course.api";

export default function InstructorStats() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
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
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const totalCourses = courses.length;
  const publishedCourses = courses.filter(
    (c) => (c.status || "").toUpperCase() === "PUBLISHED"
  ).length;
  const draftCourses = courses.filter(
    (c) => (c.status || "DRAFT").toUpperCase() === "DRAFT"
  ).length;
  const totalStudents = courses.reduce(
    (sum, c) => sum + (c.studentsCount || 0),
    0
  );

  const stats = [
    {
      title: "Total Courses",
      value: loading ? "..." : String(totalCourses),
      subtitle: "Created in studio",
      badge: "All Time",
      icon: BookOpen,
      gradient: "from-indigo-500 to-blue-600",
      accentBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "Published Courses",
      value: loading ? "..." : String(publishedCourses),
      subtitle: "Live on platform",
      badge: "Active",
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Draft Courses",
      value: loading ? "..." : String(draftCourses),
      subtitle: "In development",
      badge: "Pending",
      icon: FileEdit,
      gradient: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Total Students",
      value: loading ? "..." : String(totalStudents),
      subtitle: "Enrolled learners",
      badge: "Growth",
      icon: Users,
      gradient: "from-purple-500 to-pink-600",
      accentBg: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  return (
    <section>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              {/* Top accent line */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.gradient}`}
              />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {stat.title}
                    </p>
                  </div>

                  <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-110 ${stat.accentBg}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="font-medium text-slate-500">
                  {stat.subtitle}
                </span>

                <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3 text-indigo-600" />
                  {stat.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}