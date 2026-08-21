"use client";

import { useState } from "react";
import { CourseDetailItem, approveCourse, rejectCourse } from "@/lib/api/admin";
import RejectModal from "./RejectModal";
import { Check, X, Film, HelpCircle, FileText, CheckCircle2 } from "lucide-react";

interface CourseReviewProps {
  course: CourseDetailItem;
  onRefresh: () => void;
}

export default function CourseReview({ course, onRefresh }: CourseReviewProps) {
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApprove = async () => {
    if (!confirm(`Are you sure you want to approve and publish "${course.title}"?`)) return;
    try {
      setLoading(true);
      setMessage(null);
      const res = await approveCourse(course.id);
      setMessage({ type: "success", text: res.message });
      onRefresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to approve course" });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    try {
      setLoading(true);
      setMessage(null);
      const res = await rejectCourse(course.id, reason);
      setMessage({ type: "success", text: res.message });
      onRefresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to reject course" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header Inspector Control */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                course.status === "PUBLISHED"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : course.status === "REJECTED"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {course.status.replace("_", " ")}
            </span>
            <span className="text-xs font-medium text-slate-400">ID: {course.id}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{course.title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Instructor: <span className="text-slate-900 font-bold">{course.instructor.name}</span> ({course.instructor.email})
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleApprove}
            disabled={loading || course.status === "PUBLISHED"}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-sm disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Approve & Publish
          </button>
          <button
            onClick={() => setIsRejectOpen(true)}
            disabled={loading}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition shadow-sm disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Reject Course
          </button>
        </div>
      </div>

      {/* Rejection History Alert */}
      {course.rejectionReason && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-900">
          <h4 className="font-bold text-sm text-rose-800 uppercase tracking-wider mb-1">
            ⚠️ Active Rejection Reason
          </h4>
          <p className="text-sm">{course.rejectionReason}</p>
          {course.reviewedBy && (
            <p className="text-xs text-rose-600 mt-2 font-medium">
              Reviewed by {course.reviewedBy.name} on {new Date(course.reviewedAt || "").toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Category</span>
          <p className="text-lg font-extrabold text-slate-900 mt-1">{course.category}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Level</span>
          <p className="text-lg font-extrabold text-slate-900 mt-1">{course.level}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Price</span>
          <p className="text-lg font-extrabold text-blue-600 mt-1">
            {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString("en-IN")}`}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Curriculum</span>
          <p className="text-lg font-extrabold text-indigo-600 mt-1">
            {course.sections.length} Sections
          </p>
        </div>
      </div>

      {/* Course Description */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-xs">
        <h3 className="font-bold text-lg text-slate-900">Course Summary & Overview</h3>
        {course.shortDescription && (
          <p className="text-sm font-semibold text-blue-900 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            {course.shortDescription}
          </p>
        )}
        <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
          {course.description}
        </div>
      </div>

      {/* Curriculum & Renditions Tree */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-lg text-slate-900">Curriculum & Video Pipeline Renditions</h3>
          <span className="text-xs text-slate-500 font-medium">
            Verifying 360p, 720p, 1080p Renditions & Quiz Pass Marks
          </span>
        </div>

        {course.sections.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No sections added to this course.</p>
        ) : (
          <div className="space-y-6">
            {course.sections.map((section, idx) => (
              <div key={section.id} className="border border-slate-200 bg-slate-50/50 rounded-2xl overflow-hidden">
                {/* Section Header */}
                <div className="bg-slate-100/80 p-4 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Section {idx + 1}: {section.title}
                  </h4>
                  <span className="text-xs text-slate-500 font-semibold">
                    {section.lessons.length} Lessons
                  </span>
                </div>

                {/* Lesson List */}
                <div className="divide-y divide-slate-100 p-2">
                  {section.lessons.map((lesson) => (
                    <div key={lesson.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white transition rounded-xl">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              lesson.type === "VIDEO"
                                ? "bg-blue-50 text-blue-700"
                                : lesson.quiz
                                ? "bg-purple-50 text-purple-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {lesson.type}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {lesson.title}
                          </span>
                          {lesson.isFreePreview && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold uppercase">
                              Free Preview
                            </span>
                          )}
                        </div>
                        {lesson.description && (
                          <p className="text-xs text-slate-500 mt-1">{lesson.description}</p>
                        )}
                      </div>

                      {/* Video Rendition / Quiz Details */}
                      <div className="flex items-center gap-3">
                        {lesson.asset ? (
                          <div className="flex items-center gap-2 text-[11px] bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                            <Film className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-slate-400 font-medium">Renditions:</span>
                            <span className={`font-bold ${lesson.asset.renditions.res360p ? "text-emerald-600" : "text-slate-300"}`}>360p</span>
                            <span className={`font-bold ${lesson.asset.renditions.res720p ? "text-emerald-600" : "text-slate-300"}`}>720p</span>
                            <span className={`font-bold ${lesson.asset.renditions.res1080p ? "text-emerald-600" : "text-slate-300"}`}>1080p</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                lesson.asset.status === "READY"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {lesson.asset.status}
                            </span>
                          </div>
                        ) : lesson.quiz ? (
                          <div className="flex items-center gap-1.5 text-[11px] bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl text-purple-800 font-semibold">
                            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                            {lesson.quiz.questionCount} Questions • Pass: {lesson.quiz.passMark}%
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">No media attached</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RejectModal
        isOpen={isRejectOpen}
        courseTitle={course.title}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleReject}
      />
    </div>
  );
}
