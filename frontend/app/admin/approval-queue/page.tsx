"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { fetchPendingCourses, approveCourseApi, rejectCourseApi, PendingCourse } from "@/lib/api/admin.api";

export default function ApprovalQueuePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<PendingCourse[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role?.toLowerCase() !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role?.toLowerCase() === "admin") {
      fetchPendingCourses().then(setCourses).catch(() => {});
    }
  }, [user]);

  if (loading || !user || user.role?.toLowerCase() !== "admin") return null;

  const handleApprove = async (id: string, title: string) => {
    await approveCourseApi(id).catch(() => {});
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setNotification(`Approved "${title}"! Revalidated catalogue tag-based cache.`);
  };

  const handleReject = async (id: string, title: string) => {
    await rejectCourseApi(id, "Needs revisions").catch(() => {});
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setNotification(`Returned "${title}" to instructor draft.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Course Approval Queue & Moderation</h1>
          <p className="text-xs text-slate-400">Review instructor courses and publish to catalogue with tag-based cache revalidation.</p>
        </div>
        <button onClick={() => router.push("/admin")} className="text-xs text-indigo-400 hover:text-indigo-300">
          ← Back to Admin Command Center
        </button>
      </div>

      {notification && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
          {notification}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400 text-sm">
          🎉 No courses pending review!
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">{c.title}</h3>
                <p className="text-xs text-slate-400">Instructor: {c.instructor} ({c.instructorEmail})</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => handleApprove(c.id, c.title)} className="bg-emerald-600 px-4 py-2 text-xs font-semibold text-white rounded-lg">
                  Approve & Publish
                </button>
                <button onClick={() => handleReject(c.id, c.title)} className="border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-2 text-xs font-semibold rounded-lg">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
