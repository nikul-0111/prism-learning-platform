"use client";

import { useEffect, useState, use } from "react";
import { CourseDetailItem, getAdminCourseDetails } from "@/lib/api/admin";
import CourseReview from "@/components/admin/CourseReview";
import Link from "next/link";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  const [course, setCourse] = useState<CourseDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminCourseDetails(courseId);
      setCourse(res);
    } catch (err: any) {
      setError(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/courses/pending"
        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
      >
        ← Back to Approval Queue
      </Link>

      {loading ? (
        <div className="py-20 text-center text-indigo-400 text-sm font-semibold">
          Inspecting Course & Video Pipeline Details...
        </div>
      ) : error || !course ? (
        <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          {error || "Course not found"}
        </div>
      ) : (
        <CourseReview course={course} onRefresh={loadCourse} />
      )}
    </div>
  );
}
