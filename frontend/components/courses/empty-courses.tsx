export default function EmptyCourses() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <h3 className="text-xl font-semibold text-slate-900">
        No courses found
      </h3>

      <p className="mt-2 text-slate-600">
        Try changing your search or filters.
      </p>
    </div>
  );
}