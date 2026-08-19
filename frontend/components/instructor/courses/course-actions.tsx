"use client";

import Link from "next/link";
import { useState } from "react";
import DeleteCourseDialog from "./delete-course-dialog";

interface CourseActionsProps {
  courseId: string;
  onDeleted?: (courseId: string) => void;
}

export default function CourseActions({
  courseId,
  onDeleted,
}: CourseActionsProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1">
        <Link
          href={`/instructor/courses/${courseId}/edit`}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
          title="Edit course"
        >
          ✎
        </Link>

        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          title="Delete course"
        >
          🗑
        </button>
      </div>

      {showDelete && (
        <DeleteCourseDialog
          courseId={courseId}
          onClose={() => setShowDelete(false)}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
}