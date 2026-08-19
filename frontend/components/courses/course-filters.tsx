"use client";

import { useState } from "react";

export default function CourseFilters() {
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [price, setPrice] = useState("all");

  return (
    <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Find Your Perfect Course
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Filter courses based on your interests and learning level.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-700"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              📚
            </span>
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full cursor-pointer rounded-xl border border-indigo-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-200 hover:border-indigo-300 hover:shadow-md focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">All Categories</option>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
            <option value="data">Data & Analytics</option>
            <option value="technology">Technology</option>
          </select>
        </div>

        {/* Level */}
        <div>
          <label
            htmlFor="level"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-700"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              🎯
            </span>
            Level
          </label>

          <select
            id="level"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="w-full cursor-pointer rounded-xl border border-purple-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-200 hover:border-purple-300 hover:shadow-md focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              💰
            </span>
            Price
          </label>

          <select
            id="price"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="w-full cursor-pointer rounded-xl border border-blue-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-200 hover:border-blue-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>
    </div>
  );
}