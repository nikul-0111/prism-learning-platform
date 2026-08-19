"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Edit3,
  Layers,
  Video,
  FileText,
  HelpCircle,
  Clock,
  User,
  ShieldCheck,
  Tag,
  Loader2,
  CheckCircle,
  Eye,
  Plus,
  PlayCircle,
  Lock,
} from "lucide-react";
import { getPublicCourseById, PublicCourse } from "@/lib/api/public.api";
import LessonPreviewModal from "@/components/instructor/curriculum/lesson-preview-modal";
import { Lesson } from "@/lib/api/instructor-lesson.api";

export default function InstructorCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedPreviewLesson, setSelectedPreviewLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!courseId) return;

    async function loadCourseDetails() {
      try {
        setLoading(true);
        setError("");
        const res = await getPublicCourseById(courseId);
        if (res?.data) {
          setCourse(res.data);
          if (res.data.sections) {
            const initialMap: Record<string, boolean> = {};
            res.data.sections.forEach((sec) => {
              initialMap[sec.id] = true;
            });
            setExpandedSections(initialMap);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }

    loadCourseDetails();
  }, [courseId]);

  const toggleSection = (secId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [secId]: !prev[secId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <span>Loading Instructor Course Dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center space-y-4">
          <h2 className="text-lg font-extrabold text-red-900">Course Not Found</h2>
          <p className="text-xs text-red-700">{error || "Could not retrieve course information."}</p>
          <Link
            href="/instructor/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  // Calculate detailed content metrics
  const totalSections = course.sections?.length || 0;
  let totalLessons = 0;
  let videoCount = 0;
  let articleCount = 0;
  let quizCount = 0;
  let totalDurationMinutes = 0;

  course.sections?.forEach((sec) => {
    sec.lessons?.forEach((les) => {
      totalLessons += 1;
      if (les.type === "VIDEO") videoCount += 1;
      else if (les.type === "ARTICLE") articleCount += 1;
      else if (les.type === "QUIZ") quizCount += 1;

      if (les.duration) totalDurationMinutes += les.duration;
    });
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Top Breadcrumb & Navigation Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/instructor/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Courses</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/instructor/courses/${course.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
              <span>Edit Details</span>
            </Link>

            <Link
              href={`/instructor/courses/${course.id}/curriculum`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Curriculum Builder</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-8 space-y-8">
        
        {/* HERO COURSE CARD */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-xl relative">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-10 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-xs font-black uppercase tracking-wider">
                  {course.level || "BEGINNER"}
                </span>
                {course.category?.name && (
                  <span className="rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 text-xs font-bold">
                    {course.category.name}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-extrabold border ${
                  course.status === "PUBLISHED"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {course.status === "PUBLISHED" ? "PUBLISHED TO STUDENTS" : "DRAFT MODE"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  Instructor: <strong className="text-white">{course.instructor?.name || "Instructor Faculty"}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  Total Duration: <strong className="text-white">{totalDurationMinutes} mins</strong>
                </span>
              </div>
            </div>

            {/* Course Cover Banner / Pricing */}
            <div className="rounded-3xl bg-slate-900 p-5 border border-slate-800 shadow-2xl text-center space-y-4">
              {course.thumbnail ? (
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-800 border border-slate-700">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-2xl bg-slate-800 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-slate-600" />
                </div>
              )}

              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block">Course Price</span>
                <span className="text-3xl font-black text-white">
                  {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS STATS CARDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-indigo-600">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sections</span>
              <Layers className="h-4 w-4" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalSections}</p>
            <p className="text-[11px] text-slate-500 font-medium">Curriculum Modules</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-purple-600">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Lessons</span>
              <BookOpen className="h-4 w-4" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalLessons}</p>
            <p className="text-[11px] text-slate-500 font-medium">Content Items</p>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-purple-700">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800">Video Lectures</span>
              <Video className="h-4 w-4" />
            </div>
            <p className="text-2xl font-black text-purple-950">{videoCount}</p>
            <p className="text-[11px] text-purple-700 font-medium">HLS Video Streams</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Articles</span>
              <FileText className="h-4 w-4" />
            </div>
            <p className="text-2xl font-black text-emerald-950">{articleCount}</p>
            <p className="text-[11px] text-emerald-700 font-medium">Reading Notes</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Quizzes</span>
              <HelpCircle className="h-4 w-4" />
            </div>
            <p className="text-2xl font-black text-amber-950">{quizCount}</p>
            <p className="text-[11px] text-amber-700 font-medium">Assessments</p>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-indigo-700">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">Enrollments</span>
              <User className="h-4 w-4" />
            </div>
            <p className="text-2xl font-black text-indigo-950">{course.sectionsCount || 0}</p>
            <p className="text-[11px] text-indigo-700 font-medium">Active Students</p>
          </div>

        </div>

        {/* FULL COURSE CURRICULUM BREAKDOWN */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" /> Curriculum & Content Breakdown
              </h2>
              <p className="text-xs text-slate-500 font-medium">Detailed view of all sections and lesson items created in this course</p>
            </div>

            <Link
              href={`/instructor/courses/${course.id}/curriculum`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-indigo-700 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Manage Curriculum</span>
            </Link>
          </div>

          {course.sections && course.sections.length > 0 ? (
            <div className="space-y-4">
              {course.sections.map((sec, sIdx) => {
                const isOpen = expandedSections[sec.id] ?? true;
                const lesCount = sec.lessons?.length || 0;

                return (
                  <div key={sec.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                    {/* Section Accordion Header */}
                    <div
                      onClick={() => toggleSection(sec.id)}
                      className="flex cursor-pointer items-center justify-between bg-slate-50/80 px-5 py-4 transition hover:bg-slate-100/80"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-xs font-black text-white">
                          {sIdx + 1}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900">
                          {sec.title}
                        </h3>
                      </div>

                      <span className="text-xs font-bold text-slate-500">
                        {lesCount} {lesCount === 1 ? "Lesson" : "Lessons"}
                      </span>
                    </div>

                    {/* Section Lessons List */}
                    {isOpen && (
                      <div className="divide-y divide-slate-100 p-2">
                        {sec.lessons && sec.lessons.length > 0 ? (
                          sec.lessons.map((les, lIdx) => (
                            <div
                              key={les.id}
                              className="flex flex-wrap items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold hover:bg-slate-50 transition"
                            >
                              <div className="flex items-center gap-3">
                                {les.type === "VIDEO" ? (
                                  <Video className="h-4 w-4 text-purple-600 shrink-0" />
                                ) : les.type === "ARTICLE" ? (
                                  <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
                                )}
                                <span className="font-bold text-slate-900">
                                  {lIdx + 1}. {les.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                {les.duration ? (
                                  <span className="text-[11px] text-slate-500 font-semibold">
                                    {les.duration} mins
                                  </span>
                                ) : null}

                                {les.isFreePreview && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-300">
                                    Free Preview
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setSelectedPreviewLesson(les as any)}
                                  className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>Preview</span>
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-xs text-slate-400 italic">No lessons created in this section yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 font-medium">
              No sections created yet. Click "Manage Curriculum" to build sections and lesson items.
            </div>
          )}
        </div>

      </div>

      {/* LESSON PREVIEW MODAL */}
      {selectedPreviewLesson && (
        <LessonPreviewModal
          lesson={selectedPreviewLesson}
          onClose={() => setSelectedPreviewLesson(null)}
          onEdit={() => {
            router.push(`/instructor/courses/${course.id}/curriculum`);
          }}
        />
      )}
    </div>
  );
}
