"use client";

import { useState } from "react";
import { deleteCourse } from "@/lib/api/instructor-course.api";

interface DeleteCourseDialogProps {
  courseId: string;
  onClose: () => void;
  onDeleted?: (courseId: string) => void;
}

export default function DeleteCourseDialog({
  courseId,
  onClose,
  onDeleted,
}: DeleteCourseDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    try {
      setLoading(true);
      setError("");
      await deleteCourse(courseId);

      if (onDeleted) {
        onDeleted(courseId);
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete course.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <span className="text-xl text-red-600">⚠</span>
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Delete Course?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Are you sure you want to delete this course? This action cannot be undone.
        </p>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Course"}
          </button>
        </div>
      </div>
    </div>
  );
}