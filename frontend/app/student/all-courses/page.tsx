"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
} from "lucide-react";
import { getPublicCourses, getMyEnrollmentsApi, PublicCourse } from "@/lib/api/public.api";
import CourseDetailModal from "@/components/student/courses/course-detail-modal";

const categories = [
  "All",
  "Web Development",
  "Programming",
  "Computer Science",
  "Design",
  "Data Science",
  "Business",
  "Engineering",
];
const levels = ["All Levels", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [resCourses, resEnrollments] = await Promise.all([
          getPublicCourses({ page: 1, limit: 50 }),
          getMyEnrollmentsApi().catch(() => ({ data: [] })),
        ]);

        if (resCourses?.data) {
          setCourses(resCourses.data);
        }

        if (resEnrollments?.data && Array.isArray(resEnrollments.data)) {
          const ids = resEnrollments.data.map((item) => item.courseId);
          setEnrolledCourseIds(ids);
        }
      } catch (err) {
        console.error("Failed to fetch catalogue courses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter out draft courses AND courses that student has already purchased/enrolled in
  const unpurchasedCourses = courses.filter(
    (c) => (c.status || "PUBLISHED").toUpperCase() === "PUBLISHED" && !enrolledCourseIds.includes(c.id)
  );

  const filteredCourses = unpurchasedCourses.filter((c) => {
    const rawCategory = typeof c.category === "string" ? c.category : c.category?.name || "";
    const catLower = rawCategory.toLowerCase();
    const selLower = selectedCategory.toLowerCase();
    const titleLower = c.title.toLowerCase();

    let matchesCategory = selectedCategory === "All";
    if (!matchesCategory) {
      if (catLower === selLower || catLower.includes(selLower) || selLower.includes(catLower)) {
        matchesCategory = true;
      } else if (selLower === "web development" && (catLower.includes("web") || titleLower.includes("html") || titleLower.includes("css") || titleLower.includes("react") || titleLower.includes("js") || titleLower.includes("javascript"))) {
        matchesCategory = true;
      } else if ((selLower === "programming" || selLower === "computer science" || selLower === "engineering") && (titleLower.includes("java") || titleLower.includes("python") || titleLower.includes("data") || titleLower.includes("code") || titleLower.includes("structure"))) {
        matchesCategory = true;
      }
    }

    const matchesLevel =
      selectedLevel === "All Levels" || c.level === selectedLevel;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Modern Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-xl">
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-extrabold text-indigo-200 backdrop-blur-md border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            PRISM Course Catalogue
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Master Premium Tech Skills & Projects
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-xl">
            Browse our full catalogue of video courses, real-world project modules, and verified certificates.
          </p>
        </div>
      </div>

      {/* Sleek Filter & Search Control Panel */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, technology, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-extrabold text-slate-700 outline-none transition focus:border-indigo-500 cursor-pointer"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-2xl px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Catalogue Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-indigo-300" />
          <h3 className="text-base font-black text-slate-900">No Courses Available</h3>
          <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto">
            You have already enrolled in all available courses or no courses match your active search filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => setActiveCourseId(course.id)}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl hover:-translate-y-1.5 hover:border-indigo-200 cursor-pointer"
            >
              <div className="space-y-4">
                {/* Thumbnail Image Cover */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-black text-3xl">
                      {course.title.charAt(0)}
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-xl bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider border border-white/10">
                    {course.level || "BEGINNER"}
                  </span>
                </div>

                {/* Course Header & Description */}
                <div className="space-y-2">
                  <h3 className="line-clamp-2 text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition">
                    {course.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-slate-500 font-medium leading-relaxed">
                    {course.description || course.subtitle || "Master this course with hands-on video lectures and practical assessments."}
                  </p>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Price</span>
                  <span className="text-base font-black text-slate-900">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCourseId(course.id);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2.5 text-xs font-black text-white transition shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  <span>Buy Course</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      {activeCourseId && (
        <CourseDetailModal
          courseId={activeCourseId}
          onClose={() => setActiveCourseId(null)}
        />
      )}
    </div>
  );
}
