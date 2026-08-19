"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  PlayCircle,
  Award,
  CheckCircle2,
  Sparkles,
  BookOpen,
  User,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
} from "lucide-react";
import { getMyEnrollmentsApi, PublicCourse } from "@/lib/api/public.api";

interface EnrolledCourseItem {
  id: string;
  courseId: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  level: string;
  instructorName: string;
  sectionsCount: number;
  lessonsCount: number;
  progressPercentage: number;
  isCompleted?: boolean;
}

export default function MyCoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEnrolledCourses() {
      try {
        setLoading(true);
        const res = await getMyEnrollmentsApi();
        if (res?.data && Array.isArray(res.data)) {
          const mapped: EnrolledCourseItem[] = res.data.map((item) => {
            const c = item.course;
            const secCount = c.sections?.length || c.sectionsCount || 0;
            let lesCount = c.lessonsCount || 0;
            if (!lesCount && c.sections) {
              lesCount = c.sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);
            }

            return {
              id: item.id,
              courseId: c.id,
              title: c.title,
              description: c.description,
              thumbnail: c.thumbnail,
              level: c.level || "BEGINNER",
              instructorName: c.instructor?.name || "PRISM Faculty",
              sectionsCount: secCount,
              lessonsCount: lesCount,
              progressPercentage: 0,
              isCompleted: false,
            };
          });
          setEnrolledCourses(mapped);
        } else {
          setEnrolledCourses([]);
        }
      } catch (err) {
        console.error("Failed to load enrolled courses:", err);
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    }

    loadEnrolledCourses();
  }, []);

  const totalEnrolled = enrolledCourses.length;
  const completedCount = enrolledCourses.filter((c) => c.isCompleted).length;
  const inProgressCount = totalEnrolled - completedCount;

  return (
    <div className="space-y-8">
      {/* Premium Hero Banner & Dashboard Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-indigo-200 backdrop-blur-md border border-white/10">
              <Sparkles className="h-3.5 w-3.5" /> Enrolled Learning Dashboard
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              My Learning Space
            </h1>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Welcome back! Resume your enrolled courses, track video completion, and download verified certificates.
            </p>
          </div>

          {/* Quick Stats Chips */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md border border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/30 text-indigo-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] text-indigo-200 font-medium block">Enrolled</span>
                <span className="text-lg font-black text-white">{totalEnrolled}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md border border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/30 text-purple-300">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] text-purple-200 font-medium block">In Progress</span>
                <span className="text-lg font-black text-white">{inProgressCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md border border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/30 text-emerald-300">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] text-emerald-200 font-medium block">Completed</span>
                <span className="text-lg font-black text-white">{completedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Catalogue Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Enrolled Courses</h2>
          <p className="text-xs text-slate-500">
            Select a course to open its video player and instructor curriculum.
          </p>
        </div>

        <Link
          href="/student/all-courses"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition"
        >
          <GraduationCap className="h-4 w-4 text-indigo-400" />
          <span>Browse Catalogue</span>
        </Link>
      </div>

      {/* Enrolled Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      ) : enrolledCourses.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 mx-auto border border-indigo-100">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">No Enrolled Courses Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your learning space is ready! Browse our course catalogue to buy your first course and start learning today.
            </p>
          </div>
          <Link
            href="/student/all-courses"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
          >
            <span>Explore Course Catalogue</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white font-black text-3xl shadow-inner">
                      {course.title.charAt(0)}
                    </div>
                  )}

                  <span className="absolute top-3 left-3 rounded-xl bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                    {course.level}
                  </span>

                  {course.isCompleted && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </span>
                  )}
                </div>

                {/* Course Title & Description */}
                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {course.title}
                  </h3>

                  {/* Instructor & Lesson Meta info */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="truncate max-w-[120px]">{course.instructorName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3 text-purple-500" /> {course.sectionsCount} Sec
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <PlayCircle className="h-3 w-3 text-indigo-500" /> {course.lessonsCount} Les
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Course Progress</span>
                    <span className="text-indigo-600">{course.progressPercentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                {course.isCompleted ? (
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <Award className="h-4 w-4" />
                    <span>Download Certificate</span>
                  </button>
                ) : (
                  <Link
                    href={`/student/my-courses/${course.courseId}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Start Learning</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
