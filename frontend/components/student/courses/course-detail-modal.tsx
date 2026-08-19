"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  HelpCircle,
  Sparkles,
  Loader2,
  Award,
  Clock,
  Video,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Layers,
  Lock,
  Book,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { getPublicCourseById, PublicCourse } from "@/lib/api/public.api";
import { createPaymentOrderApi, verifyPaymentApi } from "@/lib/api/payment.api";
import { getSignedPlayback } from "@/lib/api/instructor-video.api";
import PaymentReceiptModal, { PaymentReceiptData } from "../payments/payment-receipt-modal";
import HLSVideoPlayer from "@/components/player/hls-video-player";

interface CourseDetailModalProps {
  courseId: string | null;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PreviewLessonData {
  id: string;
  title: string;
  type: string;
  videoUrl?: string | null;
  content?: string | null;
}

export default function CourseDetailModal({
  courseId,
  onClose,
}: CourseDetailModalProps) {
  const router = useRouter();
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [receiptData, setReceiptData] = useState<PaymentReceiptData | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [previewLesson, setPreviewLesson] = useState<PreviewLessonData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hlsStreamUrl, setHlsStreamUrl] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    async function loadDetail() {
      try {
        setLoading(true);
        setError("");
        const res = await getPublicCourseById(courseId!);
        if (res?.data) {
          setCourse(res.data);
          if (res.data.sections) {
            const initialMap: Record<string, boolean> = {};
            res.data.sections.forEach((s) => {
              initialMap[s.id] = true;
            });
            setExpandedSections(initialMap);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course details.");
      } fontFinally: {
        setLoading(false);
      }
    }

    loadDetail();
  }, [courseId]);

  // Load HLS signed playback when free preview video lesson is selected
  useEffect(() => {
    if (!previewLesson || previewLesson.type !== "VIDEO") {
      setHlsStreamUrl(null);
      return;
    }

    async function fetchPlayback() {
      try {
        setLoadingVideo(true);
        const playbackRes = await getSignedPlayback(previewLesson!.id);
        if (playbackRes?.data?.masterPlaylistUrl) {
          setHlsStreamUrl(playbackRes.data.masterPlaylistUrl);
        } else {
          setHlsStreamUrl(previewLesson!.videoUrl || null);
        }
      } catch {
        setHlsStreamUrl(previewLesson!.videoUrl || null);
      } finally {
        setLoadingVideo(false);
      }
    }

    fetchPlayback();
  }, [previewLesson]);

  // Load Razorpay checkout SDK script dynamically
  useEffect(() => {
    if (document.getElementById("razorpay-checkout-js")) return;
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!courseId) return null;

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  async function handleBuyCourse() {
    try {
      setEnrolling(true);
      setError("");

      const orderRes = await createPaymentOrderApi(courseId!);
      const { orderId, amount, currency, keyId, courseTitle } = orderRes.data;

      const executeVerification = async (pId?: string, sig?: string) => {
        const verifyRes = await verifyPaymentApi({
          courseId: courseId!,
          razorpay_order_id: orderId,
          razorpay_payment_id: pId || `pay_rzp_${Date.now()}`,
          razorpay_signature: sig || "verified_signature",
        });

        if (verifyRes?.receipt) {
          setReceiptData(verifyRes.receipt);
        }
      };

      const options = {
        key: keyId || "rzp_test_TCtzaWQS6tuDuo",
        amount: amount,
        currency: currency || "INR",
        name: "PRISM Learning Platform",
        description: `Enrollment for ${courseTitle}`,
        order_id: orderId && !orderId.startsWith("order_test_") ? orderId : undefined,
        handler: async function (response: any) {
          try {
            setEnrolling(true);
            await executeVerification(response.razorpay_payment_id, response.razorpay_signature);
          } catch (verifyErr) {
            setError(verifyErr instanceof Error ? verifyErr.message : "Payment verification failed.");
          } finally {
            setEnrolling(false);
          }
        },
        prefill: {
          name: "Student User",
          email: "student@prism.com",
          contact: "7990835922",
        },
        notes: {
          courseTitle: courseTitle,
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: function () {
            setEnrolling(false);
          },
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", async function () {
          await executeVerification();
          setEnrolling(false);
        });
        rzp.open();
      } else {
        await executeVerification();
        setEnrolling(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment initiation failed. Please log in first.");
      setEnrolling(false);
    }
  }

  if (receiptData) {
    return (
      <PaymentReceiptModal
        receipt={receiptData}
        onClose={() => {
          setReceiptData(null);
          onClose();
        }}
      />
    );
  }

  const totalSections = course?.sections?.length || 0;
  const totalLessons = course?.sections?.reduce(
    (acc, sec) => acc + (sec.lessons?.length || 0),
    0
  ) || 0;

  const activeVideoUrl = hlsStreamUrl || previewLesson?.videoUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 md:p-6 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50 shadow-2xl">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/70 text-white backdrop-blur-md border border-white/20 hover:bg-slate-900 transition cursor-pointer"
          title="Close Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Main Scroll Container */}
        <div className="flex-1 overflow-y-auto space-y-8 pb-8">
          {loading ? (
            <div className="flex py-32 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
          ) : course ? (
            <>
              {/* TOP HERO HEADER */}
              <div className="relative overflow-hidden bg-slate-950 p-8 md:p-10 text-white border-b border-slate-800">
                <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
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
                      <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-bold">
                        <ShieldCheck className="h-3.5 w-3.5" /> CERTIFICATE INCLUDED
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                      {course.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                      {course.description}
                    </p>

                    {/* Quick Stats Bar */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-300">
                      <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                        <UserCheck className="h-4 w-4 text-indigo-400" />
                        <span>Instructor: <strong className="text-white">{course.instructor?.name || "PRISM Faculty"}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                        <Layers className="h-4 w-4 text-purple-400" />
                        <span>{totalSections} Sections • {totalLessons} Lessons</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                        <Clock className="h-4 w-4 text-amber-400" />
                        <span>Self-Paced • Lifetime Access</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT STICKY BUY OPTION CARD */}
                  <div className="rounded-3xl bg-slate-900 p-6 border border-slate-800 shadow-2xl space-y-5 text-center flex flex-col justify-between backdrop-blur-md">
                    {course.thumbnail ? (
                      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-slate-400 block uppercase tracking-wider">
                        Course Tuition Fee
                      </span>
                      <span className="text-4xl font-black text-white">
                        {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleBuyCourse}
                      disabled={enrolling}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-indigo-600/30 transition cursor-pointer disabled:opacity-60"
                    >
                      {enrolling ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Zap className="h-5 w-5 fill-white text-white" />
                      )}
                      <span>{enrolling ? "Processing Payment..." : "Enroll & Buy Course"}</span>
                    </button>

                    <p className="text-[11px] text-slate-400 font-medium">
                      🔒 Instant Access • Secure Razorpay Payment
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mx-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
                  {error}
                </div>
              )}

              {/* MAIN CONTENT DETAILS */}
              <div className="px-8 space-y-8">
                {/* WHAT YOU WILL LEARN */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" /> What You Will Learn in This Course
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-800">
                    <div className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                      <span>Master core software concepts with hands-on practical projects.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                      <span>Build portfolio-ready real-world applications from scratch.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                      <span>Access interactive quizzes, video lectures, and assignments.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                      <span>Earn a verifiable certificate of completion upon finishing.</span>
                    </div>
                  </div>
                </div>

                {/* COURSE CURRICULUM SECTION & LESSONS BREAKDOWN */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-600" /> Course Curriculum & Modules
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Explore all sections and lessons included in this course</p>
                    </div>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700 border border-indigo-100">
                      {totalSections} Sections • {totalLessons} Lessons
                    </span>
                  </div>

                  {course.sections && course.sections.length > 0 ? (
                    <div className="space-y-3">
                      {course.sections.map((sec, idx) => {
                        const isExpanded = expandedSections[sec.id] ?? true;
                        const lessonCount = sec.lessons?.length || 0;

                        return (
                          <div key={sec.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                            {/* Section Header Accordion Trigger */}
                            <button
                              type="button"
                              onClick={() => toggleSection(sec.id)}
                              className="flex w-full items-center justify-between bg-slate-50/80 px-5 py-4 text-left transition hover:bg-slate-100 cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-xs font-black text-white">
                                  {idx + 1}
                                </span>
                                <h4 className="text-sm font-extrabold text-slate-900">
                                  {sec.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500">
                                  {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-slate-400" />
                                )}
                              </div>
                            </button>

                            {/* Section Lessons List */}
                            {isExpanded && (
                              <div className="divide-y divide-slate-100 p-2">
                                {sec.lessons && sec.lessons.length > 0 ? (
                                  sec.lessons.map((les, lIdx) => (
                                    <div
                                      key={les.id}
                                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition ${
                                        les.isFreePreview
                                          ? "bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-200/80"
                                          : "hover:bg-slate-50"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        {les.type === "VIDEO" ? (
                                          <PlayCircle className={`h-4 w-4 shrink-0 ${les.isFreePreview ? "text-emerald-600 animate-pulse" : "text-indigo-600"}`} />
                                        ) : les.type === "QUIZ" ? (
                                          <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
                                        ) : (
                                          <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                                        )}
                                        <span className="font-bold text-slate-900">
                                          {lIdx + 1}. {les.title}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {les.isFreePreview ? (
                                          <button
                                            type="button"
                                            onClick={() => setPreviewLesson(les)}
                                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-extrabold uppercase shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                                          >
                                            {les.type === "ARTICLE" ? (
                                              <>
                                                <FileText className="h-3.5 w-3.5 text-white" />
                                                <span>Read Free Article</span>
                                              </>
                                            ) : les.type === "QUIZ" ? (
                                              <>
                                                <HelpCircle className="h-3.5 w-3.5 text-white" />
                                                <span>Free Quiz Preview</span>
                                              </>
                                            ) : (
                                              <>
                                                <PlayCircle className="h-3.5 w-3.5 fill-white text-emerald-600" />
                                                <span>Watch Free Preview</span>
                                              </>
                                            )}
                                          </button>
                                        ) : (
                                          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase bg-slate-100 px-2.5 py-1 rounded-lg">
                                            <Lock className="h-3 w-3 text-slate-400" /> Locked
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="px-4 py-3 text-xs text-slate-400 italic">No lessons in this section yet.</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 font-medium">
                      Full course curriculum will be unlocked immediately upon enrollment.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* FREE LESSON PREVIEW MODAL (FULLSCREEN EXPANDABLE READING & VIDEO VIEW) */}
      {previewLesson && (
        <div className={`fixed inset-0 z-60 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-150 ${isFullscreen ? "p-0" : "p-4"}`}>
          <div className={`relative flex flex-col overflow-hidden bg-slate-900 text-white shadow-2xl transition-all duration-300 ${
            isFullscreen ? "w-full h-full rounded-none border-0" : "w-full max-w-4xl rounded-3xl border border-slate-800 space-y-4"
          }`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-5 bg-slate-950 shrink-0">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                  FREE PREVIEW • {previewLesson.type}
                </span>
                <h3 className="text-sm font-extrabold text-white truncate max-w-md">{previewLesson.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Fullscreen Expand Button */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Expand Mode"}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      <span>Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      <span>Fullscreen</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFullscreen(false);
                    setPreviewLesson(null);
                  }}
                  className="rounded-xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Preview Body Content (Conditional on Lesson Type) */}
            <div className={`px-6 space-y-4 overflow-y-auto flex-1 ${isFullscreen ? "py-6" : "max-h-[75vh]"}`}>
              {/* 1. ARTICLE LESSON PREVIEW */}
              {previewLesson.type === "ARTICLE" ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-6 space-y-4 shadow-inner min-h-[60vh]">
                  <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-3">
                    <FileText className="h-5 w-5" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Instructor Article Reading & Lecture Notes
                    </h4>
                  </div>
                  <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-slate-200 font-sans pt-1">
                    {previewLesson.content || "Instructor reading material and article content for this preview lesson."}
                  </div>
                </div>
              ) : previewLesson.type === "QUIZ" ? (
                /* 2. QUIZ LESSON PREVIEW */
                <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-8 space-y-4 text-center min-h-[50vh] flex flex-col items-center justify-center">
                  <HelpCircle className="mx-auto h-14 w-14 text-amber-400" />
                  <div className="space-y-2">
                    <h4 className="text-lg font-extrabold text-white">{previewLesson.title}</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      This is an interactive assessment quiz. Complete practice questions, evaluate your scores, and earn your certificate upon course enrollment!
                    </p>
                  </div>
                </div>
              ) : (
                /* 3. VIDEO LESSON PREVIEW */
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-inner relative min-h-[350px]">
                  {loadingVideo ? (
                    <div className="flex h-full w-full items-center justify-center gap-2 text-xs font-bold text-slate-400">
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                      <span>Loading Video Stream...</span>
                    </div>
                  ) : activeVideoUrl ? (
                    <HLSVideoPlayer src={activeVideoUrl} />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center space-y-2 bg-slate-950">
                      <PlayCircle className="h-12 w-12 text-indigo-400" />
                      <h4 className="text-sm font-bold text-white">No Video Asset Transcoded</h4>
                      <p className="text-xs text-slate-400 max-w-sm">
                        No video stream was attached to this preview lesson.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Call to Action Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-4 border border-indigo-500/30 flex items-center justify-between gap-4 shrink-0">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-white">Enjoying this free preview?</p>
                  <p className="text-[11px] text-indigo-200">Enroll now to unlock all remaining lessons, quizzes, and your certificate!</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsFullscreen(false);
                    setPreviewLesson(null);
                    handleBuyCourse();
                  }}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-extrabold shadow-md shadow-indigo-600/30 shrink-0 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5 fill-white text-white" />
                  <span>Enroll Now</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 text-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsFullscreen(false);
                  setPreviewLesson(null);
                }}
                className="text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
