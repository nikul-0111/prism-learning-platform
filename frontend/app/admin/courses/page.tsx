"use client";

import { useEffect, useState } from "react";
import { PendingCourseItem, getAllAdminCourses } from "@/lib/api/admin";
import CourseApprovalTable from "@/components/admin/CourseApprovalTable";
import { Search } from "lucide-react";

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<PendingCourseItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await getAllAdminCourses(statusFilter, searchQuery);
      setCourses(res);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCourses();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, searchQuery]);

  const tabs = [
    { id: "ALL", label: "All Courses" },
    { id: "PENDING_REVIEW", label: "Pending Review" },
    { id: "PUBLISHED", label: "Published" },
    { id: "DRAFT", label: "Drafts" },
    { id: "REJECTED", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Catalogue & Course Governance
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Full management view of all platform courses across all lifecycle states.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, category, instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-blue-600 text-sm font-semibold">
          Fetching course catalogue...
        </div>
      ) : (
        <CourseApprovalTable
          courses={courses}
          onRefresh={loadCourses}
          isApprovalQueuePage={false}
        />
      )}
    </div>
  );
}
