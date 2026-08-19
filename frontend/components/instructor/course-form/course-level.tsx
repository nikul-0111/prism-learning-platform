"use client";

interface CourseLevelProps {
  level: string;
  onLevelChange: (value: string) => void;
}

export default function CourseLevel({
  level,
  onLevelChange,
}: CourseLevelProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <label
        htmlFor="level"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Level *
      </label>

      <select
        id="level"
        value={level}
        onChange={(e) => onLevelChange(e.target.value)}
        required
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
      </select>
    </section>
  );
}