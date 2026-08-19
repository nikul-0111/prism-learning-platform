"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Plus,
  Users,
} from "lucide-react";

const actions = [
  {
    title: "Create Course",
    description: "Start building a new course",
    href: "/instructor/courses/new",
    icon: Plus,
    primary: true,
  },
  {
    title: "Manage Courses",
    description: "View and edit your courses",
    href: "/instructor/courses",
    icon: BookOpen,
    primary: false,
  },
  {
    title: "View Students",
    description: "Check student enrollment",
    href: "/instructor/students",
    icon: Users,
    primary: false,
  },
  {
    title: "View Analytics",
    description: "Track learning performance",
    href: "/instructor/analytics",
    icon: BarChart3,
    primary: false,
  },
];

export default function QuickActions() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Quickly access the tools you use most.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className={`group rounded-2xl border p-5 transition ${
                action.primary
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-blue-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    action.primary
                      ? "bg-white/15"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowRight
                  className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                    action.primary
                      ? "text-blue-100"
                      : "text-slate-400"
                  }`}
                />
              </div>

              <h3 className="mt-5 text-sm font-semibold">
                {action.title}
              </h3>

              <p
                className={`mt-1 text-xs leading-5 ${
                  action.primary
                    ? "text-blue-100"
                    : "text-slate-500"
                }`}
              >
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}