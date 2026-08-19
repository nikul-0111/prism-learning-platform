"use client";

interface CourseCategoryProps {
  category: string;
  onCategoryChange: (value: string) => void;
}

export default function CourseCategory({
  category,
  onCategoryChange,
}: CourseCategoryProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <label
        htmlFor="category"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Category *
      </label>

      <select
        id="category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        required
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">Select category</option>
        <option value="PROGRAMMING">Programming</option>
        <option value="WEB_DEVELOPMENT">Web Development</option>
        <option value="DATA_SCIENCE">Data Science</option>
        <option value="DESIGN">Design</option>
        <option value="BUSINESS">Business</option>
        <option value="MARKETING">Marketing</option>
      </select>
    </section>
  );
}