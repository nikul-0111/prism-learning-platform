import Link from "next/link";

export default function EmptyCourses() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
        <span className="text-2xl">📚</span>
      </div>

      <h3 className="mt-5 text-xl font-bold text-gray-900">
        No courses found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        You haven't created any courses matching your current
        search or filters.
      </p>

      <Link
        href="/instructor/courses/new"
        className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Create Your First Course
      </Link>
    </div>
  );
}