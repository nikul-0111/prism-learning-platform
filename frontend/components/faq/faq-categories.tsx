"use client";

import {
  BookOpen,
  HelpCircle,
  Settings,
  User,
} from "lucide-react";

const categories = [
  {
    icon: HelpCircle,
    title: "General",
    description: "Basic questions about PRISM",
  },
  {
    icon: User,
    title: "Account",
    description: "Registration and account access",
  },
  {
    icon: BookOpen,
    title: "Courses",
    description: "Courses and enrollment",
  },
  {
    icon: Settings,
    title: "Technical",
    description: "Platform and technical help",
  },
];

export default function FaqCategories() {
  return (
    <section className="bg-slate-50 py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Browse Topics
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Find answers by category
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.title}
                type="button"
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="inline-flex rounded-xl bg-indigo-50 p-3 transition group-hover:bg-indigo-100">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {category.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}