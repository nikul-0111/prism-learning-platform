"use client";

import { useState } from "react";

export default function CourseSearch() {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full">
      <label
        htmlFor="course-search"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Search Courses
      </label>

      <div className="relative">
        <input
          id="course-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search for a course..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
    </div>
  );
}