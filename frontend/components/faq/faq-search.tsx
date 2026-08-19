"use client";

import { Search } from "lucide-react";

export default function FaqSearch() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search your question..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>
    </section>
  );
}