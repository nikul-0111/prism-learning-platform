"use client";

import Link from "next/link";
import { useState } from "react";
import { PendingCourseItem, approveCourse, rejectCourse } from "@/lib/api/admin";
import RejectModal from "./RejectModal";
import { Check, X, Eye } from "lucide-react";

interface CourseApprovalTableProps {
  courses: PendingCourseItem[];
  onRefresh: () => void;
  isApprovalQueuePage?: boolean;
}

export default function CourseApprovalTable({
  courses,
  onRefresh,
  isApprovalQueuePage = false,
}: CourseApprovalTableProps) {
  const [selectedCourse, setSelectedCourse] = useState<PendingCourseItem | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApprove = async (course: PendingCourseItem) => {
    if (!confirm(`Are you sure you want to approve and publish "${course.title}"?`)) {
      return;
    }

    try {
      setActionLoading(course.id);
      setMessage(null);
      const res = await approveCourse(course.id);
      setMessage({ type: "success", text: res.message });
      onRefresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to approve course" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedCourse) return;
    try {
      setActionLoading(selectedCourse.id);
      setMessage(null);
      const res = await rejectCourse(selectedCourse.id, reason);
      setMessage({ type: "success", text: res.message });
      onRefresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to reject course" });
    } finally {
      setActionLoading(null);
      setSelectedCourse(null);
    }
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-900 text-base">
          {isApprovalQueuePage ? "Approval Queue Clear" : "No Courses Found"}
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {isApprovalQueuePage
            ? "No course submissions are currently waiting for admin review."
            : "No courses match the selected status filter."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider text-[11px] text-slate-400 font-bold">
              <tr>
                <th className="px-6 py-4">Course & Category</th>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Curriculum Breakdown</th>
                <th className="px-6 py-4">Price & Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => {
                const showApproveRejectButtons =
                  isApprovalQueuePage || course.status === "PENDING_REVIEW";

                return (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition">
                    {/* Course info */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="font-bold text-slate-900 hover:text-blue-600 text-sm transition line-clamp-1"
                      >
                        {course.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {course.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{course.instructor}</p>
                      <p className="text-slate-400 text-[11px]">{course.instructorEmail}</p>
                    </td>

                    {/* Curriculum */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {course.sectionsCount} Sections • {course.lessonsCount} Lessons
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        📹 {course.videoLessonsCount} Videos • ❓ {course.quizLessonsCount} Quizzes ({course.durationMinutes} mins)
                      </p>
                    </td>

                    {/* Price & Level */}
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-blue-600 text-sm">
                        {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString("en-IN")}`}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {course.level}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                          course.status === "PENDING_REVIEW"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : course.status === "REJECTED"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : course.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {course.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect Details
                        </Link>

                        {showApproveRejectButtons && (
                          <>
                            <button
                              onClick={() => handleApprove(course)}
                              disabled={actionLoading === course.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>

                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                setIsRejectOpen(true);
                              }}
                              disabled={actionLoading === course.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {selectedCourse && (
        <RejectModal
          isOpen={isRejectOpen}
          courseTitle={selectedCourse.title}
          onClose={() => {
            setIsRejectOpen(false);
            setSelectedCourse(null);
          }}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  );
}
