"use client";

import { useAuth } from "@/context/auth-context";
import {
  TrendingUp,
  Users,
  BookOpen,
  Star,
  DollarSign,
  Award,
  Clock,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

interface AnalyticsData {
  totalRevenue: string;
  netEarnings: string;
  totalStudents: number;
  totalCourses: number;
  avgCompletion: number;
  avgRating: number;
  totalWatchHours: number;
}

interface CoursePerformanceItem {
  title: string;
  students: number;
  revenue: string;
  completion: number;
  rating: number;
  color: string;
}

interface StudentActivityItem {
  name: string;
  course: string;
  action: string;
  time: string;
  progress: number;
}

export default function ProfessionalInstructorAnalyticsPage() {
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState<"30d" | "7d" | "90d" | "all">("30d");
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: "₹0",
    netEarnings: "₹0",
    totalStudents: 0,
    totalCourses: 0,
    avgCompletion: 0,
    avgRating: 5.0,
    totalWatchHours: 0,
  });

  const [coursePerformance, setCoursePerformance] = useState<CoursePerformanceItem[]>([]);
  const [recentStudentActivities, setRecentStudentActivities] = useState<StudentActivityItem[]>([]);

  useEffect(() => {
    async function fetchLiveAnalytics() {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/analytics/instructor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            if (data.data.summary) {
              setAnalytics(data.data.summary);
            }
            if (Array.isArray(data.data.coursePerformance)) {
              setCoursePerformance(data.data.coursePerformance);
            } else {
              setCoursePerformance([]);
            }
            if (Array.isArray(data.data.recentStudentActivities)) {
              setRecentStudentActivities(data.data.recentStudentActivities);
            } else {
              setRecentStudentActivities([]);
            }
          }
        }
      } catch (err) {
        console.error("Error loading live backend analytics from DB:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveAnalytics();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* HEADER & TIME RANGE CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
              <Activity className="h-3.5 w-3.5 text-indigo-600" /> REAL-TIME ANALYTICS & INSIGHTS
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              DATABASE SOURCED
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Performance & Revenue Analytics</h1>
          <p className="text-xs font-medium text-slate-500 max-w-xl">
            Track total earnings, course engagement, student completion rates, and sales trends across <strong>your courses</strong>.
          </p>
        </div>

        {/* Controls */}
        <div className="z-10 flex flex-wrap items-center gap-3">
          {/* Time Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {(["7d", "30d", "90d", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  timeRange === range
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "3 Months" : "All Time"}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition cursor-pointer"
          >
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* TOP KPI STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-indigo-200 transition">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              GROSS SALES
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">{analytics.totalRevenue}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Gross Sales</span>
            <span className="font-extrabold text-emerald-600">Net: {analytics.netEarnings}</span>
          </div>
        </div>

        {/* Total Enrolled Students */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-purple-200 transition">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              BUYERS
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">{analytics.totalStudents} Buyers</p>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Enrolled Students</span>
            <span className="font-bold text-slate-700">{analytics.totalCourses} Courses</span>
          </div>
        </div>

        {/* Average Course Completion */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">COMPLETION</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{analytics.avgCompletion}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(analytics.avgCompletion, 100)}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-slate-500">Average Student Progress</p>
        </div>

        {/* Rating & Engagement */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-amber-200 transition">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">RATING</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{analytics.avgRating} ★</p>
          <p className="text-xs font-semibold text-slate-500">{analytics.totalWatchHours} Total Watch Hours</p>
        </div>
      </div>

      {/* VISUAL REVENUE CHART & COURSE POPULARITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Popularity & Revenue Distribution (Left 2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-extrabold text-slate-900">Course Revenue & Student Distribution</h2>
            </div>
            <span className="text-xs font-extrabold text-slate-500">{coursePerformance.length} Active Courses</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-extrabold text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              <span>Loading course performance analytics...</span>
            </div>
          ) : coursePerformance.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-2">
              <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
              <p className="text-sm font-extrabold text-slate-800">No Course Performance Data Yet</p>
              <p className="text-xs text-slate-400">When students enroll in your courses, individual course revenue and completion rates will appear here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coursePerformance.map((course, idx) => (
                <div key={idx} className="space-y-2.5 rounded-2xl bg-slate-50 p-5 border border-slate-200">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-900 font-extrabold">{course.title}</span>
                    <span className="text-indigo-600 font-black text-base">{course.revenue}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                    <span>{course.students} Enrolled Learners</span>
                    <span>{course.completion}% Avg Progress</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${course.color || "bg-indigo-600"} rounded-full transition-all`}
                      style={{ width: `${Math.min(course.completion, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overview Key Summary (Right 1 Col) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Analytics Overview</h2>
          </div>

          <div className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-100 space-y-2">
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">Course Portfolio</span>
              <p className="text-xl font-black text-slate-900">{analytics.totalCourses} Published Courses</p>
              <p className="text-slate-500 text-[11px]">Active in PRISM Catalogue</p>
            </div>

            <div className="rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100 space-y-2">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Net Revenue Share (90%)</span>
              <p className="text-xl font-black text-emerald-950">{analytics.netEarnings}</p>
              <p className="text-emerald-700 text-[11px]">Eligible Net Payout Balance</p>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT LEARNING ACTIVITIES & STUDENT ENGAGEMENT */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Recent Student Activity Feed</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">Live Database Sourced</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-extrabold text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Loading recent activity events...</span>
          </div>
        ) : recentStudentActivities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-2">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <p className="text-sm font-extrabold text-slate-800">No Activity Events Yet</p>
            <p className="text-xs text-slate-400">Student enrollment and learning events for your courses will appear here in real time!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentStudentActivities.map((act, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-600/20">
                    {act.name ? act.name.charAt(0).toUpperCase() : "S"}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{act.name}</h4>
                    <p className="text-[11px] font-medium text-slate-600">{act.action}</p>
                    <p className="text-[10px] font-bold text-indigo-600">{act.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-slate-400">{act.time}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 border border-emerald-200">
                    {act.progress}% Progress
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}