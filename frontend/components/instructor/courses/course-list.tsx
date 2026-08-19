"use client";

import { useEffect, useMemo, useState } from "react";
import CourseCard from "./course-card";
import CourseSearch from "./course-search";
import CourseFilters from "./course-filters";
import CreateCourseButton from "./create-course-button";
import EmptyCourses from "./empty-courses";
import { getAllCourses, Course } from "@/lib/api/instructor-course.api";

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    async function loadCourses() {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("prism_token");
        if (!token) {
          setLoading(false);
          return;
        }
      }

      try {
        setLoading(true);
        const res = await getAllCourses();
        if (res?.courses) {
          setCourses(res.courses);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  function handleCourseDeleted(deletedId: string) {
    setCourses((prev) => prev.filter((c) => c.id !== deletedId));
  }

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        (course.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (course.shortDescription || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || course.category === category;

      const matchesStatus =
        status === "All" ||
        (course.status || "DRAFT").toUpperCase() === status.toUpperCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [courses, search, category, status]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Instructor Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            My Courses
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create, manage and monitor all your courses.
          </p>
        </div>

        <CreateCourseButton />
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Courses</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {courses.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Published</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {courses.filter((course) => (course.status || "").toUpperCase() === "PUBLISHED").length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {courses.filter((course) => (course.status || "DRAFT").toUpperCase() === "DRAFT").length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="mt-2 text-2xl font-bold text-indigo-600">
            {courses.reduce((total, course) => total + (course.studentsCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CourseSearch value={search} onChange={setSearch} />

          <CourseFilters
            category={category}
            status={status}
            onCategoryChange={setCategory}
            onStatusChange={setStatus}
          />
        </div>
      </div>

      {/* Course results */}
      {filteredCourses.length === 0 ? (
        <EmptyCourses />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Your Courses
              </h2>

              <p className="text-sm text-gray-500">
                {filteredCourses.length} course
                {filteredCourses.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course as any}
                onDeleted={handleCourseDeleted}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}