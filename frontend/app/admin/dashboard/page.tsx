"use client";

import { useEffect, useState } from "react";
import { PlatformMetrics, PendingCourseItem, getAdminMetrics, getPendingCourses } from "@/lib/api/admin";
import MetricCard from "@/components/admin/MetricCard";
import CourseApprovalTable from "@/components/admin/CourseApprovalTable";
import AdminWelcomeBanner from "@/components/admin/AdminWelcomeBanner";
import { BookOpen, CheckCircle2, Clock, Users, HardDrive, CircleDollarSign } from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [pendingCourses, setPendingCourses] = useState<PendingCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [m, p] = await Promise.all([getAdminMetrics(), getPendingCourses()]);
      setMetrics(m);
      setPendingCourses(p);
    } catch (err: any) {
      setError(err.message || "Failed to load admin metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-blue-600 font-bold text-sm">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Loading PRISM Dashboard...
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
        <p className="font-bold">Error loading dashboard:</p>
        <p>{error}</p>
        <button
          onClick={loadData}
          className="mt-3 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <AdminWelcomeBanner pendingCount={pendingCourses.length} />

      {/* Primary Metrics Grid (Matches Instructor Dashboard Grid) */}
      <section>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Courses"
            value={metrics.courseMetrics.totalCourses}
            subtitle="Platform catalogue"
            trend="All Time"
            variant="indigo"
            icon={<BookOpen className="h-6 w-6" />}
          />

          <MetricCard
            title="Published Courses"
            value={metrics.courseMetrics.publishedCourses}
            subtitle="Live on platform"
            trend="Active"
            variant="emerald"
            icon={<CheckCircle2 className="h-6 w-6" />}
          />

          <MetricCard
            title="Pending Review"
            value={metrics.courseMetrics.pendingReviewCourses}
            subtitle="Awaiting admin approval"
            trend="Pending"
            variant="amber"
            icon={<Clock className="h-6 w-6" />}
          />

          <MetricCard
            title="Total Students"
            value={metrics.userMetrics.totalStudents}
            subtitle="Enrolled learners"
            trend="Growth"
            variant="purple"
            icon={<Users className="h-6 w-6" />}
          />
        </div>
      </section>

      {/* Secondary System Overview Grid */}
      <section>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Instructors"
            value={metrics.userMetrics.totalInstructors}
            subtitle="Course creators"
            trend="Studio"
            variant="sky"
            icon={<Users className="h-6 w-6" />}
          />

          <MetricCard
            title="Total Storage Used"
            value={`${metrics.storageMetrics.totalStorageMB} MB`}
            subtitle={`HLS: ${metrics.storageMetrics.hlsStorageMB} MB`}
            trend="Storage"
            variant="amber"
            icon={<HardDrive className="h-6 w-6" />}
          />

          <MetricCard
            title="Gross Revenue"
            value={`₹${metrics.revenueMetrics.totalRevenue.toLocaleString("en-IN")}`}
            subtitle="Platform course sales"
            trend="Gross"
            variant="emerald"
            icon={<CircleDollarSign className="h-6 w-6" />}
          />

          <MetricCard
            title="Platform Fee (20%)"
            value={`₹${metrics.revenueMetrics.platformFee.toLocaleString("en-IN")}`}
            subtitle="Net: ₹"
            trend="Fee"
            variant="rose"
            icon={<CircleDollarSign className="h-6 w-6" />}
          />
        </div>
      </section>

      {/* Course Approval Queue Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              COURSE MANAGEMENT
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Course Approval Queue
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Review and approve courses submitted by instructors before publishing to the catalogue.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            {pendingCourses.length} Pending Actions
          </span>
        </div>

        <CourseApprovalTable courses={pendingCourses} onRefresh={loadData} />
      </section>
    </div>
  );
}
