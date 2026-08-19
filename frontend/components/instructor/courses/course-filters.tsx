interface CourseFiltersProps {
  category: string;
  status: string;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function CourseFilters({
  category,
  status,
  onCategoryChange,
  onStatusChange,
}: CourseFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="All">All Categories</option>
        <option value="Development">Development</option>
        <option value="Backend">Backend</option>
        <option value="Programming">Programming</option>
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="All">All Status</option>
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
      </select>
    </div>
  );
}