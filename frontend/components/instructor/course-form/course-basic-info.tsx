"use client";

interface CourseBasicInfoProps {
  title: string;
  shortDescription: string;
  onTitleChange: (value: string) => void;
  onShortDescriptionChange: (value: string) => void;
}

export default function CourseBasicInfo({
  title,
  shortDescription,
  onTitleChange,
  onShortDescriptionChange,
}: CourseBasicInfoProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Basic Information
      </h2>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Course Title *
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter course title"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="shortDescription"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Short Description *
          </label>

          <input
            id="shortDescription"
            type="text"
            value={shortDescription}
            onChange={(e) => onShortDescriptionChange(e.target.value)}
            placeholder="Enter short description"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>
    </section>
  );
}