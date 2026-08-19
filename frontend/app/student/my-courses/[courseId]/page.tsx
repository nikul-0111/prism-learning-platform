"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import HlsVideoPlayer from "@/components/player/hls-video-player";
import ArticleReader from "@/components/student/lessons/article-reader";
import QuizRunner, { DynamicQuizQuestion } from "@/components/student/lessons/quiz-runner";
import { getPublicCourseById, getQuizByLessonApi, PublicCourse } from "@/lib/api/public.api";

interface LessonItem {
  id: string;
  title: string;
  type: string;
  videoUrl?: string | null;
  content?: string | null;
  duration?: number;
  isFreePreview?: boolean;
}

interface SectionItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

export default function StudentCoursePlayerPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);
  const [allFlatLessons, setAllFlatLessons] = useState<LessonItem[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Dynamic Instructor Quiz State
  const [quizQuestions, setQuizQuestions] = useState<DynamicQuizQuestion[]>([]);
  const [quizPassMark, setQuizPassMark] = useState<number>(70);
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);

  useEffect(() => {
    async function loadCoursePlayer() {
      try {
        setLoading(true);
        const res = await getPublicCourseById(courseId);
        if (res?.data) {
          setCourse(res.data);

          // Collect all flat lessons for Next/Prev navigation
          const flatList: LessonItem[] = [];
          const initialExpanded: Record<string, boolean> = {};

          if (res.data.sections && res.data.sections.length > 0) {
            res.data.sections.forEach((sec) => {
              initialExpanded[sec.id] = true;
              if (sec.lessons) {
                flatList.push(...sec.lessons);
              }
            });
          }

          setAllFlatLessons(flatList);
          setExpandedSections(initialExpanded);

          if (flatList.length > 0) {
            setActiveLesson(flatList[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load course player details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCoursePlayer();
  }, [courseId]);

  // Fetch exact instructor questions when active lesson is a QUIZ
  useEffect(() => {
    if (activeLesson && activeLesson.type === "QUIZ") {
      async function loadQuizQuestions() {
        try {
          setLoadingQuiz(true);
          const res = await getQuizByLessonApi(activeLesson!.id);
          if (res?.data?.quiz) {
            setQuizPassMark(res.data.quiz.passMark || 70);
            if (res.data.quiz.questions) {
              setQuizQuestions(res.data.quiz.questions as DynamicQuizQuestion[]);
            }
          }
        } catch (err) {
          console.error("Failed to load instructor quiz questions:", err);
        } finally {
          setLoadingQuiz(false);
        }
      }
      loadQuizQuestions();
    }
  }, [activeLesson]);

  function toggleSection(secId: string) {
    setExpandedSections((prev) => ({
      ...prev,
      [secId]: !prev[secId],
    }));
  }

  // Next / Previous Lesson index logic
  const currentLessonIdx = activeLesson
    ? allFlatLessons.findIndex((l) => l.id === activeLesson.id)
    : -1;
  const hasPrev = currentLessonIdx > 0;
  const hasNext = currentLessonIdx >= 0 && currentLessonIdx < allFlatLessons.length - 1;

  function handleGoPrev() {
    if (hasPrev) {
      setActiveLesson(allFlatLessons[currentLessonIdx - 1]);
    }
  }

  function handleGoNext() {
    if (hasNext) {
      setActiveLesson(allFlatLessons[currentLessonIdx + 1]);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4">
        <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-900">Course Not Found</h2>
        <Link
          href="/student/my-courses"
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/student/my-courses"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                <Sparkles className="h-3 w-3" /> Enrolled Student Access
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900">{course.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <User className="h-4 w-4 text-indigo-500" />
          <span>Instructor: <strong className="text-slate-900">{course.instructor?.name || "PRISM Faculty"}</strong></span>
        </div>
      </div>

      {/* Main Layout Grid (Player/Content on Left, Curriculum Sidebar on Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Content Renderer (Video / Article / Quiz) */}
        <div className="lg:col-span-2 space-y-6">
          {activeLesson ? (
            activeLesson.type === "QUIZ" ? (
              loadingQuiz ? (
                <div className="flex h-64 items-center justify-center space-y-3 rounded-3xl border border-slate-200 bg-white p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                </div>
              ) : (
                <QuizRunner
                  title={activeLesson.title}
                  passMark={quizPassMark}
                  questions={quizQuestions}
                  onComplete={() => {}}
                />
              )
            ) : activeLesson.type === "ARTICLE" || (!activeLesson.videoUrl && activeLesson.type !== "VIDEO") ? (
              <ArticleReader
                title={activeLesson.title}
                content={activeLesson.content}
                onComplete={() => {}}
              />
            ) : (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl">
                  {activeLesson.videoUrl ? (
                    <HlsVideoPlayer
                      src={activeLesson.videoUrl}
                      poster={course.thumbnail}
                    />
                  ) : (
                    <div className="flex aspect-video w-full flex-col items-center justify-center p-8 text-center text-white space-y-3 bg-slate-900">
                      <PlayCircle className="h-16 w-16 text-indigo-500 opacity-60" />
                      <h3 className="text-lg font-bold">{activeLesson.title}</h3>
                      <p className="text-xs text-slate-400 max-w-sm">
                        {activeLesson.content || "Video content for this lesson will stream here."}
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                  <span className="rounded-xl bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Current Video Lecture
                  </span>
                  <h2 className="text-xl font-black text-slate-900">{activeLesson.title}</h2>
                  {activeLesson.content && (
                    <p className="text-xs text-slate-600 leading-relaxed">{activeLesson.content}</p>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
              Select a lesson from the curriculum sidebar on the right to start learning.
            </div>
          )}

          {/* Bottom Next / Previous Lesson Navigation Bar */}
          <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <button
              type="button"
              onClick={handleGoPrev}
              disabled={!hasPrev}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 px-4 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Lesson</span>
            </button>

            <button
              type="button"
              onClick={handleGoNext}
              disabled={!hasNext}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <span>Next Lesson</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Instructor Curriculum Sidebar (Sections & Lessons with Color Badges) */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" /> Course Curriculum
            </h3>

            {course.sections && course.sections.length > 0 ? (
              <div className="space-y-3">
                {course.sections.map((sec, secIdx) => (
                  <div
                    key={sec.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    {/* Section Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleSection(sec.id)}
                      className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-100 cursor-pointer"
                    >
                      <span className="text-xs font-extrabold text-slate-900">
                        Section {secIdx + 1}: {sec.title}
                      </span>
                      {expandedSections[sec.id] ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </button>

                    {/* Section Lessons List */}
                    {expandedSections[sec.id] && (
                      <div className="space-y-1.5 p-2.5 pt-0">
                        {sec.lessons && sec.lessons.length > 0 ? (
                          sec.lessons.map((les) => {
                            const isSelected = activeLesson?.id === les.id;
                            const isQuiz = les.type === "QUIZ";
                            const isArticle = les.type === "ARTICLE" || (!les.videoUrl && les.type !== "VIDEO");

                            return (
                              <button
                                key={les.id}
                                type="button"
                                onClick={() => setActiveLesson(les)}
                                className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition cursor-pointer text-xs font-semibold ${
                                  isSelected
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                    : "bg-white text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/60"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 truncate">
                                  {isQuiz ? (
                                    <HelpCircle className={`h-4 w-4 shrink-0 ${isSelected ? "text-white" : "text-amber-600"}`} />
                                  ) : isArticle ? (
                                    <FileText className={`h-4 w-4 shrink-0 ${isSelected ? "text-white" : "text-emerald-600"}`} />
                                  ) : (
                                    <PlayCircle className={`h-4 w-4 shrink-0 ${isSelected ? "text-white" : "text-indigo-600"}`} />
                                  )}
                                  <span className="truncate">{les.title}</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${
                                      isSelected
                                        ? "bg-white/20 text-white"
                                        : isQuiz
                                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                                        : isArticle
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                    }`}
                                  >
                                    {isQuiz ? "Quiz" : isArticle ? "Article" : "Video"}
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <p className="p-3 text-[11px] text-slate-400 italic">No lessons in this section.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No sections created for this course yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
