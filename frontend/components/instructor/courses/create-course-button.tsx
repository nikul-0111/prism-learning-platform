import Link from "next/link";

export default function CreateCourseButton() {
  return (
    <Link
      href="/instructor/courses/new"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
    >
      <span className="text-lg">+</span>
      Create Course
    </Link>
  );
}