"use client";

interface CourseDescriptionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export default function CourseDescription({
  description,
  onDescriptionChange,
}: CourseDescriptionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Course Description
      </h2>

      <div className="mt-5">
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter detailed course description"
          rows={6}
          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
    </section>
  );
}