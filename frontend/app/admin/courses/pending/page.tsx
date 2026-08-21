"use client";

import { useEffect, useState } from "react";
import { PendingCourseItem, ApprovalHistoryItem, getPendingCourses, getApprovalHistory } from "@/lib/api/admin";
import CourseApprovalTable from "@/components/admin/CourseApprovalTable";
import ApprovalHistoryTable from "@/components/admin/ApprovalHistoryTable";
import { History, Clock } from "lucide-react";

export default function PendingCoursesPage() {
  const [pendingCourses, setPendingCourses] = useState<PendingCourseItem[]>([]);
  const [historyCourses, setHistoryCourses] = useState<ApprovalHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pendingRes, historyRes] = await Promise.all([
        getPendingCourses(),
        getApprovalHistory(),
      ]);
      setPendingCourses(pendingRes);
      setHistoryCourses(historyRes);
    } catch (err: any) {
      setError(err.message || "Failed to load course approvals data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Course Approvals & Governance History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review pending course submissions and inspect complete historical approval/rejection audit logs with dates and reviewer feedback.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("pending")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
            activeTab === "pending"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Queue</span>
          {pendingCourses.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
              {pendingCourses.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
            activeTab === "history"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Approval Log & History</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-extrabold">
            {historyCourses.length}
          </span>
        </button>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-blue-600 text-sm font-semibold">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading course approvals and history logs...
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      ) : activeTab === "pending" ? (
        <CourseApprovalTable
          courses={pendingCourses}
          onRefresh={loadData}
          isApprovalQueuePage={true}
        />
      ) : (
        <ApprovalHistoryTable history={historyCourses} />
      )}
    </div>
  );
}
