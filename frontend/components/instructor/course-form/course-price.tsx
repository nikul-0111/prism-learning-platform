"use client";

interface CoursePriceProps {
  price: string;
  onPriceChange: (value: string) => void;
}

export default function CoursePrice({
  price,
  onPriceChange,
}: CoursePriceProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <label
        htmlFor="price"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Price
      </label>

      <input
        id="price"
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => onPriceChange(e.target.value)}
        placeholder="0.00"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

      <p className="mt-2 text-xs text-slate-500">
        Enter 0 for a free course.
      </p>
    </section>
  );
}