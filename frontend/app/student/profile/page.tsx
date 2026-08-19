"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  Phone,
  BookOpen,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Calendar,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getMyEnrollmentsApi, PublicCourse } from "@/lib/api/public.api";

interface EnrollmentData {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  course: PublicCourse;
}

export default function SimpleStudentProfilePage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real student enrollments from backend database
  useEffect(() => {
    async function loadStudentData() {
      try {
        setLoading(true);
        const res = await getMyEnrollmentsApi();
        if (res?.data && Array.isArray(res.data)) {
          setEnrollments(res.data);
        } else {
          setEnrollments([]);
        }
      } catch (err) {
        console.error("Failed to load student enrollments from backend:", err);
        setEnrollments([]);
      } fontFinally: {
        setLoading(false);
      }
    }

    loadStudentData();
  }, []);

  const totalBuyCourses = enrollments.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 font-sans">
      {/* PROFILE HEADER BANNER */}
      <div className="relative rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-900 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="px-8 pb-8 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-3xl font-black text-white flex items-center justify-center border-4 border-white shadow-xl shadow-indigo-600/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900">{user?.name || "Student User"}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" /> VERIFIED LEARNER
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 flex items-center justify-center sm:justify-start gap-4 pt-1">
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" /> {user?.email || "student@prism.com"}</span>
                {user?.mobileNumber && (
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" /> {user.mobileNumber}</span>
                )}
              </p>
            </div>
          </div>

          <Link
            href="/student/all-courses"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>Browse Catalogue</span>
          </Link>
        </div>
      </div>

      {/* DYNAMIC BACKEND STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Buy / Enrolled Courses */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-indigo-200 transition">
          <div className="flex justify-between items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
              LIVE FROM BACKEND
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900">{loading ? "..." : `${totalBuyCourses} Courses`}</p>
          <p className="text-xs font-semibold text-slate-500">Total Enrolled / Purchased Courses</p>
        </div>

        {/* Account Role */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-purple-200 transition">
          <div className="flex justify-between items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <UserIcon className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase">
              ACCOUNT TYPE
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900">{user?.role || "STUDENT"}</p>
          <p className="text-xs font-semibold text-slate-500">PRISM Platform Role</p>
        </div>

        {/* Member Status */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-emerald-200 transition">
          <div className="flex justify-between items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
              STATUS
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900">Active</p>
          <p className="text-xs font-semibold text-slate-500">Verified Student Account</p>
        </div>
      </div>

      {/* STUDENT PROFILE INFORMATION & PURCHASED COURSES */}
      <div className="space-y-6">
        {/* STUDENT ACCOUNT DETAILS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Student Profile Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Full Name</span>
              <p className="text-sm font-bold text-slate-900">{user?.name || "N/A"}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Email Address</span>
              <p className="text-sm font-bold text-slate-900">{user?.email || "N/A"}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Mobile Phone Number</span>
              <p className="text-sm font-bold text-slate-900">{user?.mobileNumber || "Not Provided"}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">User Role</span>
              <p className="text-sm font-bold text-indigo-600">{user?.role || "STUDENT"}</p>
            </div>
          </div>
        </div>

        {/* BOUGHT COURSES LIST FROM BACKEND DATABASE */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Enrolled & Purchased Courses</h2>
              <p className="text-xs text-slate-500">Live database records for {user?.name || "your account"}</p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 border border-indigo-100">
              {totalBuyCourses} Courses
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs font-semibold text-slate-400 animate-pulse">
              Loading courses from backend database...
            </div>
          ) : enrollments.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-8 text-center space-y-3 border border-slate-200/60">
              <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">No Enrolled Courses Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You have not enrolled in any courses yet. Browse our catalogue to enroll in a course!
                </p>
              </div>
              <Link
                href="/student/all-courses"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrollments.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-5 bg-white space-y-3 hover:border-indigo-200 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {item.course.level || "BEGINNER"}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">{item.course.title}</h3>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ENROLLED
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <span>Instructor: <strong className="text-slate-700">{item.course.instructor?.name || "PRISM Faculty"}</strong></span>
                    <span>Price: <strong className="text-slate-900">{item.course.price === 0 ? "Free" : `$${item.course.price}`}</strong></span>
                  </div>

                  <Link
                    href={`/student/my-courses/${item.course.id}`}
                    className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 transition"
                  >
                    <PlayCircle className="h-4 w-4 text-indigo-400" />
                    <span>Open Course Player</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
