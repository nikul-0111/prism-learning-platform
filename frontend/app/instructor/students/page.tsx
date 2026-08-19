"use client";

import { useAuth } from "@/context/auth-context";
import {
  Users,
  Search,
  BookOpen,
  Mail,
  Phone,
  Calendar,
  Award,
  CheckCircle2,
  TrendingUp,
  X,
  FileText,
  ExternalLink,
  Shield,
  Sparkles,
  Filter,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

interface StudentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentMobile: string;
  courseId: string;
  courseTitle: string;
  coursePrice: string;
  enrolledAt: string;
  progress: number;
}

export default function ProfessionalInstructorStudentsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"buyers" | "all">("buyers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState<StudentRecord[]>([]);

  useEffect(() => {
    async function fetchStudents() {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/enrollments/instructor-students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setStudentList(data.data);
          } else {
            setStudentList([]);
          }
        } else {
          setStudentList([]);
        }
      } catch (err) {
        console.error("Failed to load instructor students from DB:", err);
        setStudentList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [token]);

  // Filter students based on search query & course selection
  const filteredStudents = studentList.filter((std) => {
    const matchesSearch =
      std.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.studentMobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse =
      selectedCourseFilter === "all" || std.courseTitle === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  const courseOptions = Array.from(new Set(studentList.map((s) => s.courseTitle)));

  // Real Analytics Calculations
  const totalStudentsCount = studentList.length;
  const avgProgress =
    totalStudentsCount > 0
      ? Math.round(studentList.reduce((acc, s) => acc + (s.progress || 0), 0) / totalStudentsCount)
      : 0;
  const completedCount = studentList.filter((s) => s.progress >= 90).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
              <Shield className="h-3.5 w-3.5 text-indigo-600" /> INSTRUCTOR STUDENT DIRECTORY
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              {totalStudentsCount} Real Buyers
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Students & Enrolled Learners</h1>
          <p className="text-xs font-medium text-slate-500 max-w-xl">
            Monitor students who purchased <strong>your courses</strong>, track their learning completion, and view full buyer details.
          </p>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="z-10 flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
          <button
            onClick={() => setActiveTab("buyers")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer ${
              activeTab === "buyers"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="h-4 w-4 text-indigo-600" />
            Enrolled Course Buyers ({totalStudentsCount})
          </button>
        </div>
      </div>

      {/* STATS ANALYTICS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">TOTAL</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalStudentsCount} Students</p>
          <p className="text-xs font-semibold text-slate-500">Enrolled in Your Courses</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">AVERAGE</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{avgProgress}% Avg Progress</p>
          <p className="text-xs font-semibold text-slate-500">Course Completion Rate</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">COMPLETED</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{completedCount} Graduated</p>
          <p className="text-xs font-semibold text-slate-500">Issued Course Certificates</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">COURSES</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{courseOptions.length} Active</p>
          <p className="text-xs font-semibold text-slate-500">Courses with Active Students</p>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Enrolled Students Directory</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone or course..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Course Filter */}
            <div className="relative">
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-500 focus:bg-white"
              >
                <option value="all">All Courses ({studentList.length})</option>
                {courseOptions.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* STUDENTS TABLE */}
        {loading ? (
          <div className="py-16 text-center text-xs font-extrabold text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Fetching real enrolled student records from database...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center space-y-3">
            <Users className="mx-auto h-12 w-12 text-slate-300" />
            <p className="text-base font-extrabold text-slate-800">
              {searchQuery || selectedCourseFilter !== "all"
                ? "No enrolled students matched your search"
                : "No Enrolled Students Yet"}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {searchQuery || selectedCourseFilter !== "all"
                ? "Try clearing your search query or dropdown filter."
                : "When students enroll in or purchase your courses, their real profiles, progress, and contact details will appear here automatically!"}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Student Profile</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Enrolled Course</th>
                  <th className="px-5 py-3.5">Learning Progress</th>
                  <th className="px-5 py-3.5">Date Enrolled</th>
                  <th className="px-5 py-3.5 text-right">Student Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition">
                    {/* Student Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-600/20">
                          {std.studentName ? std.studentName.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900">{std.studentName}</div>
                          <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                            BUYER
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="px-5 py-4">
                      <div className="text-slate-800 font-semibold flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> {std.studentEmail}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-slate-400" /> {std.studentMobile}
                      </div>
                    </td>

                    {/* Course Title & Price */}
                    <td className="px-5 py-4 max-w-xs font-bold text-slate-800">
                      <div className="line-clamp-1">{std.courseTitle}</div>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {std.coursePrice}
                      </span>
                    </td>

                    {/* Progress Bar */}
                    <td className="px-5 py-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px] font-extrabold text-slate-800">
                          <span>{std.progress}%</span>
                          <span className="text-slate-400">Completed</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full"
                            style={{ width: `${std.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Date Enrolled */}
                    <td className="px-5 py-4 text-slate-500 text-[11px] font-semibold">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> {std.enrolledAt}
                      </div>
                    </td>

                    {/* Details Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(std)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-[11px] font-extrabold text-indigo-700 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" /> View Data
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* STUDENT PROFILE & DATA MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                {selectedStudent.studentName ? selectedStudent.studentName.charAt(0).toUpperCase() : "S"}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedStudent.studentName}</h3>
                <p className="text-xs font-semibold text-indigo-600">Enrolled Student & Course Buyer</p>
              </div>
            </div>

            {/* Student Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs">
              <div>
                <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">Email Address</span>
                <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-indigo-600" /> {selectedStudent.studentEmail}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">Mobile Number</span>
                <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                  <Phone className="h-3.5 w-3.5 text-indigo-600" /> {selectedStudent.studentMobile}
                </span>
              </div>
            </div>

            {/* Course Purchase Details */}
            <div className="space-y-3 rounded-2xl bg-indigo-50/60 p-4 border border-indigo-100 text-xs">
              <div className="flex justify-between border-b border-indigo-100 pb-2">
                <span className="font-semibold text-indigo-700">Enrolled Course</span>
                <span className="font-bold text-slate-900 max-w-[200px] text-right truncate">
                  {selectedStudent.courseTitle}
                </span>
              </div>
              <div className="flex justify-between border-b border-indigo-100 pb-2">
                <span className="font-semibold text-indigo-700">Amount Paid</span>
                <span className="font-black text-emerald-700">{selectedStudent.coursePrice}</span>
              </div>
              <div className="flex justify-between border-b border-indigo-100 pb-2">
                <span className="font-semibold text-indigo-700">Enrollment Date</span>
                <span className="font-medium text-slate-800">{selectedStudent.enrolledAt}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-semibold text-indigo-700">Current Progress</span>
                <span className="font-black text-indigo-900">{selectedStudent.progress}% Complete</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`mailto:${selectedStudent.studentEmail}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
              >
                <Mail className="h-4 w-4" /> Send Email to Student
              </a>
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}